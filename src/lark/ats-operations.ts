/**
 * ATS Record Operations
 *
 * CRUD operations for ATS records in Lark Base
 */

import { getLarkClient, getBaseAppToken } from './client.js';

// Lark Base field value type (compatible with SDK)
type LarkFieldValue = Record<string, string | number | boolean | string[]>;

// ATS Record Interface
export interface ATSRecord {
  担当CA名?: string;
  求職者氏名?: string;
  送客元?: string;
  紹介企業名?: string;
  選考ステップ?: string;
  ヨミ?: string;
  ネクストアクション?: string;
  初回面談日?: number; // Unix timestamp in milliseconds
  入社承諾日?: number;
  入社日?: number;
  決定年収?: number;
  '現職（企業）'?: string;
  現職種?: string;
  希望職種?: string;
}

interface ListRecordsResponse {
  code: number;
  msg: string;
  data?: {
    has_more: boolean;
    page_token?: string;
    total: number;
    items: Array<{
      record_id: string;
      fields: Record<string, unknown>;
    }>;
  };
}

interface CreateRecordResponse {
  code: number;
  msg: string;
  data?: {
    record: {
      record_id: string;
      fields: Record<string, unknown>;
    };
  };
}

interface UpdateRecordResponse {
  code: number;
  msg: string;
  data?: {
    record: {
      record_id: string;
      fields: Record<string, unknown>;
    };
  };
}

interface DeleteRecordResponse {
  code: number;
  msg: string;
  data?: {
    deleted: boolean;
  };
}

export class ATSOperations {
  private client = getLarkClient();
  private appToken = getBaseAppToken();
  private tableId: string;

  constructor(tableId: string) {
    this.tableId = tableId;
  }

  /**
   * List all records with optional filter
   */
  async listRecords(options?: {
    pageSize?: number;
    pageToken?: string;
    filter?: string;
    sort?: string[];
  }): Promise<ListRecordsResponse['data']> {
    const result = await this.client.bitable.appTableRecord.list({
      path: {
        app_token: this.appToken,
        table_id: this.tableId,
      },
      params: {
        page_size: options?.pageSize ?? 100,
        page_token: options?.pageToken,
        filter: options?.filter,
        sort: options?.sort?.join(','),
      },
    }) as ListRecordsResponse;

    if (result.code !== 0) {
      throw new Error(`Failed to list records: ${result.msg}`);
    }

    return result.data;
  }

  /**
   * Get a single record by ID
   */
  async getRecord(recordId: string): Promise<Record<string, unknown>> {
    const result = await this.client.bitable.appTableRecord.get({
      path: {
        app_token: this.appToken,
        table_id: this.tableId,
        record_id: recordId,
      },
    });

    if ((result as { code: number }).code !== 0) {
      throw new Error(`Failed to get record: ${(result as { msg: string }).msg}`);
    }

    return (result as { data: { record: { fields: Record<string, unknown> } } }).data.record.fields;
  }

  /**
   * Create a new record
   */
  async createRecord(fields: ATSRecord): Promise<string> {
    const result = await this.client.bitable.appTableRecord.create({
      path: {
        app_token: this.appToken,
        table_id: this.tableId,
      },
      data: {
        fields: this.convertToLarkFields(fields),
      },
    }) as CreateRecordResponse;

    if (result.code !== 0) {
      throw new Error(`Failed to create record: ${result.msg}`);
    }

    return result.data!.record.record_id;
  }

  /**
   * Create multiple records at once
   */
  async batchCreateRecords(records: ATSRecord[]): Promise<string[]> {
    const result = await this.client.bitable.appTableRecord.batchCreate({
      path: {
        app_token: this.appToken,
        table_id: this.tableId,
      },
      data: {
        records: records.map((fields) => ({
          fields: this.convertToLarkFields(fields),
        })),
      },
    });

    if ((result as { code: number }).code !== 0) {
      throw new Error(`Failed to batch create records: ${(result as { msg: string }).msg}`);
    }

    return (result as { data: { records: Array<{ record_id: string }> } }).data.records.map((r) => r.record_id);
  }

  /**
   * Update a record
   */
  async updateRecord(recordId: string, fields: Partial<ATSRecord>): Promise<void> {
    const result = await this.client.bitable.appTableRecord.update({
      path: {
        app_token: this.appToken,
        table_id: this.tableId,
        record_id: recordId,
      },
      data: {
        fields: this.convertToLarkFields(fields),
      },
    }) as UpdateRecordResponse;

    if (result.code !== 0) {
      throw new Error(`Failed to update record: ${result.msg}`);
    }
  }

  /**
   * Delete a record
   */
  async deleteRecord(recordId: string): Promise<void> {
    const result = await this.client.bitable.appTableRecord.delete({
      path: {
        app_token: this.appToken,
        table_id: this.tableId,
        record_id: recordId,
      },
    }) as DeleteRecordResponse;

    if (result.code !== 0) {
      throw new Error(`Failed to delete record: ${result.msg}`);
    }
  }

  /**
   * Delete multiple records
   */
  async batchDeleteRecords(recordIds: string[]): Promise<void> {
    const result = await this.client.bitable.appTableRecord.batchDelete({
      path: {
        app_token: this.appToken,
        table_id: this.tableId,
      },
      data: {
        records: recordIds,
      },
    });

    if ((result as { code: number }).code !== 0) {
      throw new Error(`Failed to batch delete records: ${(result as { msg: string }).msg}`);
    }
  }

  /**
   * Convert ATSRecord to Lark Base field format
   */
  private convertToLarkFields(fields: Partial<ATSRecord>): LarkFieldValue {
    const larkFields: LarkFieldValue = {};

    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null) continue;

      // Handle date fields
      if (['初回面談日', '入社承諾日', '入社日'].includes(key) && typeof value === 'number') {
        larkFields[key] = value;
      }
      // Handle single select fields
      else if (['担当CA名', '送客元', '選考ステップ', 'ヨミ'].includes(key)) {
        larkFields[key] = value as string;
      }
      // Handle number fields
      else if (key === '決定年収' && typeof value === 'number') {
        larkFields[key] = value;
      }
      // Handle text fields
      else {
        larkFields[key] = value as string;
      }
    }

    return larkFields;
  }
}

/**
 * Helper: Convert Date to Lark timestamp (milliseconds)
 */
export function dateToLarkTimestamp(date: Date): number {
  return date.getTime();
}

/**
 * Helper: Convert Lark timestamp to Date
 */
export function larkTimestampToDate(timestamp: number): Date {
  return new Date(timestamp);
}
