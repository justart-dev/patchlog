import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface BatchExecutionDetails {
  [key: string]: any;
  steamDataFetched?: boolean;
  steamItemsCount?: number;
}

export class BatchLogger {
  static async logStart(batchName: string, details?: BatchExecutionDetails) {
    try {
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
        console.error('Failed to log batch start:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Failed to log batch start:', error);
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