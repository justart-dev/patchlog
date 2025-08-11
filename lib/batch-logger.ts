import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    SUPABASE_URL: supabaseUrl ? 'present' : 'missing',
    SUPABASE_SERVICE_ROLE_KEY: supabaseKey ? 'present' : 'missing'
  });
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export interface BatchExecutionDetails {
  [key: string]: any;
  steamDataFetched?: boolean;
  steamItemsCount?: number;
}

export class BatchLogger {
  static async logStart(batchName: string, details?: BatchExecutionDetails) {
    try {
      // 환경변수 누락 체크
      if (!supabaseUrl || !supabaseKey) {
        console.error('Cannot log batch start: Missing Supabase credentials');
        return null;
      }

      const { data, error } = await supabase
        .from('batch_execution_logs')
        .insert({
          batch_name: batchName,
          status: 'started',
          execution_details: details || {},
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to log batch start - Supabase error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return null;
      }

      console.log('Batch start logged successfully with ID:', data.id);
      return data.id;
    } catch (error) {
      console.error('Failed to log batch start - Unexpected error:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      return null;
    }
  }

  static async logSuccess(logId: string, details?: BatchExecutionDetails) {
    try {
      const updateData: any = {
        status: 'success',
        finished_at: new Date().toISOString(),
        execution_details: details || {},
      };

      if (details?.steamDataFetched !== undefined) {
        updateData.steam_data_fetched = details.steamDataFetched;
      }
      if (details?.steamItemsCount !== undefined) {
        updateData.steam_items_count = details.steamItemsCount;
      }

      const { error } = await supabase
        .from('batch_execution_logs')
        .update(updateData)
        .eq('id', logId);

      if (error) {
        console.error('Failed to log batch success:', error);
      }
    } catch (error) {
      console.error('Failed to log batch success:', error);
    }
  }

  static async logFailure(logId: string, errorMessage: string, details?: BatchExecutionDetails) {
    try {
      const updateData: any = {
        status: 'failed',
        finished_at: new Date().toISOString(),
        error_message: errorMessage,
        execution_details: details || {},
      };

      if (details?.steamDataFetched !== undefined) {
        updateData.steam_data_fetched = details.steamDataFetched;
      }
      if (details?.steamItemsCount !== undefined) {
        updateData.steam_items_count = details.steamItemsCount;
      }

      const { error } = await supabase
        .from('batch_execution_logs')
        .update(updateData)
        .eq('id', logId);

      if (error) {
        console.error('Failed to log batch failure:', error);
      }
    } catch (error) {
      console.error('Failed to log batch failure:', error);
    }
  }
}