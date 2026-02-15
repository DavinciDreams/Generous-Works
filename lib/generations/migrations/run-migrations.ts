/**
 * Migration Runner for Generations Management
 * Executes all migration files in order
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';
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

// Migration files in order
const migrations = [
  '001_create_generations_table.sql',
  '002_create_generations_history_table.sql',
  '003_create_templates_table.sql',
  '004_create_shares_table.sql',
  '005_create_analytics_table.sql',
];

/**
 * Split SQL into individual statements
 * Handles multi-line statements and comments
 */
function splitSQLStatements(sql: string): string[] {
  const statements: string[] = [];
  let currentStatement = '';
  let inComment = false;
  let inFunction = false;
  let parenCount = 0;

  const lines = sql.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comment lines
    if (trimmed.startsWith('--')) {
      continue;
    }
    
    // Track function boundaries for $$ delimiters
    if (trimmed.includes('$$')) {
      inFunction = !inFunction;
    }
    
    // Track parentheses for function bodies
    parenCount += (line.match(/\(/g) || []).length;
    parenCount -= (line.match(/\)/g) || []).length;
    
    currentStatement += line + '\n';
    
    // End of statement if not in function and has semicolon
    if (!inFunction && parenCount === 0 && trimmed.endsWith(';')) {
      const stmt = currentStatement.trim();
      if (stmt.length > 0) {
        statements.push(stmt);
      }
      currentStatement = '';
    }
  }
  
  // Add any remaining statement
  const remaining = currentStatement.trim();
  if (remaining.length > 0) {
    statements.push(remaining);
  }
  
  return statements;
}

async function runMigration(migrationFile: string): Promise<void> {
  console.log(`\n📋 Running migration: ${migrationFile}`);
  
  try {
    const migrationPath = join(__dirname, migrationFile);
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    const statements = splitSQLStatements(migrationSQL);
    console.log(`   Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement.length > 0) {
        console.log(`   Executing statement ${i + 1}/${statements.length}...`);
        await sql.query(statement);
      }
    }
    
    console.log(`✅ Successfully executed: ${migrationFile}`);
  } catch (error: any) {
    console.error(`❌ Error executing ${migrationFile}:`, error.message);
    console.error('   Error details:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting database migrations...\n');
  
  for (const migration of migrations) {
    await runMigration(migration);
  }
  
  console.log('\n✨ All migrations completed successfully!');
}

main().catch(error => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
