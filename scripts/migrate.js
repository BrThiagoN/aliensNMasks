import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const { Client } = pg;

// Common Supabase pooler regions to fallback if direct host fails with IPv6
const POOLER_REGIONS = [
  'sa-east-1',    // São Paulo (Brasil)
  'us-east-1',    // North Virginia
  'us-east-2',    // Ohio
  'us-west-1',    // North California
  'us-west-2',    // Oregon
  'eu-central-1', // Frankfurt
  'eu-west-1',    // Ireland
  'ap-southeast-1'// Singapore
];

function parseDatabaseUrl(rawUrl) {
  if (!rawUrl) return null;
  try {
    const url = new URL(rawUrl);
    const password = decodeURIComponent(url.password);
    const rawUser = decodeURIComponent(url.username);
    const host = url.hostname;
    const port = parseInt(url.port || '5432', 10);
    const database = url.pathname.replace('/', '') || 'postgres';

    // Check if host is direct supabase host (e.g. db.seu-projeto-ref.supabase.co)
    const match = host.match(/^db\.([a-z0-9]+)\.supabase\.co$/);
    const projectRef = match ? match[1] : (rawUser.includes('.') ? rawUser.split('.')[1] : null);

    return {
      rawUrl,
      host,
      port,
      user: rawUser,
      password,
      database,
      projectRef
    };
  } catch {
    return null;
  }
}

async function getWorkingClient(parsed) {
  // First attempt: try connecting with provided connection string
  try {
    console.log(`🔌 Tentando conectar ao banco (${parsed.host}:${parsed.port})...`);
    const directClient = new Client({
      connectionString: parsed.rawUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000
    });
    await directClient.connect();
    console.log('✅ Conectado com sucesso via connection string fornecida!');
    return directClient;
  } catch (err) {
    console.warn(`⚠️ Conexão direta falhou (${err.message}).`);
  }

  // If direct host failed and we have projectRef, try pooler hosts
  if (parsed.projectRef) {
    const poolerUser = `postgres.${parsed.projectRef}`;
    for (const region of POOLER_REGIONS) {
      const poolerHost = `aws-0-${region}.pooler.supabase.com`;
      console.log(`🔄 Tentando conexão IPv4 via Pooler (${poolerHost}:6543)...`);
      try {
        const poolerClient = new Client({
          host: poolerHost,
          port: 6543,
          user: poolerUser,
          password: parsed.password,
          database: parsed.database,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 3500
        });
        await poolerClient.connect();
        console.log(`✅ Conexão estabelecida com sucesso no Pooler [${region}]!`);
        return poolerClient;
      } catch {
        // Continue to next region
      }
    }
  }

  throw new Error('Não foi possível conectar ao banco de dados em nenhuma das regiões testadas.');
}

async function runMigrations() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error('❌ ERRO: A variável de ambiente DATABASE_URL não foi definida.');
    process.exit(1);
  }

  const parsed = parseDatabaseUrl(rawUrl);
  if (!parsed) {
    console.error('❌ ERRO: Formato inválido de DATABASE_URL.');
    process.exit(1);
  }

  let client;
  try {
    client = await getWorkingClient(parsed);
  } catch (err) {
    console.error(`❌ Falha de conexão: ${err.message}`);
    process.exit(1);
  }

  try {
    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS public._schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Read migration files
    const migrationsDir = path.join(rootDir, 'supabase', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('ℹ️ Diretório supabase/migrations não encontrado.');
      process.exit(0);
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    console.log(`📁 Encontradas ${files.length} migrações para verificar...`);

    for (const file of files) {
      const { rows } = await client.query(
        'SELECT version FROM public._schema_migrations WHERE version = $1',
        [file]
      );

      if (rows.length > 0) {
        console.log(`⏭️  Pulando migração já aplicada: ${file}`);
        continue;
      }

      console.log(`🚀 Executando migração: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO public._schema_migrations (version) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`✨ Migração concluída com sucesso: ${file}`);
      } catch (migrationErr) {
        await client.query('ROLLBACK');
        console.error(`❌ Erro ao executar ${file}:`, migrationErr.message);
        throw migrationErr;
      }
    }

    console.log('🎉 Todas as migrações foram aplicadas com sucesso!');
  } finally {
    await client.end();
  }
}

runMigrations().catch((err) => {
  console.error('❌ Falha fatal nas migrações:', err);
  process.exit(1);
});
