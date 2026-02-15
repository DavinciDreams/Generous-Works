/**
 * Verify Database Migrations
 * Checks if all tables were created successfully
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Create neon client
const sql = neon(DATABASE_URL);

async function verifyTables() {
  console.log('🔍 Verifying database tables...\n');
  
  const tables = [
    'generations',
    'generations_history',
    'templates',
    'shares',
    'analytics',
  ];
  
  for (const table of tables) {
    try {
      const result = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${table}
        );
      `;
      
      const exists = result[0].exists;
      if (exists) {
        console.log(`✅ Table '${table}' exists`);
        
        // Get row count
        const countResult = await sql`SELECT COUNT(*) as count FROM ${table}`;
        console.log(`   Rows: ${countResult[0].count}`);
      } else {
        console.log(`❌ Table '${table}' does not exist`);
      }
    } catch (error: any) {
      console.error(`❌ Error checking table '${table}':`, error.message);
    }
  }
  
  console.log('\n✨ Verification complete!');
}

verifyTables().catch(error => {
  console.error('\n❌ Verification failed:', error);
  process.exit(1);
});
