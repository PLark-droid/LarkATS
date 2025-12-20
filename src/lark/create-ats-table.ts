/**
 * Create ATS Table in Lark Base
 *
 * This script creates the ATS (Applicant Tracking System) table
 * with all required fields in Lark Base.
 */

import { getLarkClient, getBaseAppToken } from './client.js';
import { ATSFields, ATS_TABLE_NAME } from './ats-schema.js';

interface CreateTableResponse {
  code: number;
  msg: string;
  data?: {
    table_id: string;
    default_view_id: string;
    field_id_list: string[];
  };
}

interface CreateFieldResponse {
  code: number;
  msg: string;
  data?: {
    field: {
      field_id: string;
      field_name: string;
      type: number;
    };
  };
}

async function createATSTable(): Promise<void> {
  const client = getLarkClient();
  const appToken = getBaseAppToken();

  console.log('🚀 Starting ATS table creation...');
  console.log(`📋 Base App Token: ${appToken}`);
  console.log(`📊 Table Name: ${ATS_TABLE_NAME}`);
  console.log(`📝 Fields to create: ${ATSFields.length}`);
  console.log('');

  try {
    // Step 1: Create the table
    console.log('Step 1: Creating table...');

    const createTableResult = await client.bitable.appTable.create({
      path: {
        app_token: appToken,
      },
      data: {
        table: {
          name: ATS_TABLE_NAME,
        },
      },
    }) as CreateTableResponse;

    if (createTableResult.code !== 0) {
      throw new Error(`Failed to create table: ${createTableResult.msg}`);
    }

    const tableId = createTableResult.data!.table_id;
    console.log(`✅ Table created successfully! Table ID: ${tableId}`);
    console.log('');

    // Step 2: Create fields
    console.log('Step 2: Creating fields...');

    for (const field of ATSFields) {
      console.log(`  Creating field: ${field.field_name}...`);

      const createFieldResult = await client.bitable.appTableField.create({
        path: {
          app_token: appToken,
          table_id: tableId,
        },
        data: {
          field_name: field.field_name,
          type: field.type,
          description: field.description ? { text: field.description } : undefined,
          property: field.property,
        },
      }) as CreateFieldResponse;

      if (createFieldResult.code !== 0) {
        console.log(`  ⚠️  Warning: Failed to create field ${field.field_name}: ${createFieldResult.msg}`);
      } else {
        console.log(`  ✅ Field created: ${field.field_name} (ID: ${createFieldResult.data?.field?.field_id})`);
      }
    }

    console.log('');
    console.log('🎉 ATS table creation completed!');
    console.log('');
    console.log('Summary:');
    console.log(`  - Table ID: ${tableId}`);
    console.log(`  - Table Name: ${ATS_TABLE_NAME}`);
    console.log(`  - Fields Created: ${ATSFields.length}`);
    console.log('');
    console.log('Next steps:');
    console.log('  1. Open Lark Base and verify the table');
    console.log('  2. Configure view settings as needed');
    console.log('  3. Set up automations if required');

  } catch (error) {
    console.error('❌ Error creating ATS table:', error);
    throw error;
  }
}

// Run if this is the entry point
createATSTable().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
