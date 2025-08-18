import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // 최근 24시간 내 배치 실행 기록 조회
    const { data: recentBatches, error } = await supabase
      .from('batch_execution_logs')
      .select('*')
      .gte('started_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('started_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    // 마지막 성공한 배치
    const lastSuccess = recentBatches?.find(batch => batch.status === 'success');
    
    // 마지막 실패한 배치
    const lastFailure = recentBatches?.find(batch => batch.status === 'failed');
    
    // 오늘 배치 실행 여부 체크
    const today = new Date().toISOString().split('T')[0];
    const todayBatches = recentBatches?.filter(batch => 
      batch.started_at?.startsWith(today)
    );

    const status = {
      healthy: todayBatches && todayBatches.length > 0,
      lastSuccess: lastSuccess ? {
        timestamp: lastSuccess.started_at,
        translatedPatchesCount: lastSuccess.steam_items_count || 0 // 실제 번역한 패치 수
      } : null,
      lastFailure: lastFailure ? {
        timestamp: lastFailure.started_at,
        error: lastFailure.error_message
      } : null,
      todayExecutions: todayBatches?.length || 0,
      recentBatches: recentBatches?.map(batch => ({
        status: batch.status,
        timestamp: batch.started_at,
        duration: batch.finished_at && batch.started_at 
          ? Math.round((new Date(batch.finished_at).getTime() - new Date(batch.started_at).getTime()) / 1000)
          : null,
        error: batch.error_message
      })) || []
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      ...status
    });

  } catch (error) {
    console.error('Failed to get batch status:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get batch status',
        timestamp: new Date().toISOString(),
        healthy: false
      }, 
      { status: 500 }
    );
  }
}