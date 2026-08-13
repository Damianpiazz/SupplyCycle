import 'dotenv/config';

const nodeEnv = process.env['NODE_ENV'] ?? 'development';

// Production fail-fast (SPEC-10 C5): never boot with placeholder secrets in prod.
// dotenv never overrides already-set keys, so these checks run after .env loads.
if (nodeEnv === 'production') {
  if (!process.env['JWT_SECRET']) {
    throw new Error('JWT_SECRET is required');
  }
  if (!process.env['SESSION_SECRET']) {
    throw new Error('SESSION_SECRET is required');
  }
}

export const env = {
  nodeEnv,
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  databaseUrl: process.env['DATABASE_URL'] ?? '',
  jwtSecret: process.env['JWT_SECRET'] ?? 'supplycycle-dev-secret',
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '24h',
  bcryptSaltRounds: parseInt(process.env['BCRYPT_SALT_ROUNDS'] ?? '10', 10),
  corsOrigin: process.env['CORS_ORIGIN'] ?? '*',
  logLevel: process.env['LOG_LEVEL'] ?? 'debug',
  sessionSecret: process.env['SESSION_SECRET'] ?? 'supplycycle-session-secret',
  botApiKey: process.env['BOT_API_KEY'] ?? '',
  botApiUrl: process.env['BOT_API_URL'] ?? 'http://localhost:3008',
  botApiKeyOutgoing: process.env['BOT_API_KEY_OUTGOING'] ?? '',
  cronEnvasesDemorados: process.env['CRON_ENVASES_DEMORADOS'] ?? '0 8 * * *',
} as const;
