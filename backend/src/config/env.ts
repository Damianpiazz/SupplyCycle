import 'dotenv/config';

export const env = {
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
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
