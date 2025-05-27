import * as dotenv from 'dotenv';
import * as path from 'path';
import * as pkg from '../../package.json';
import { ConfigHelper } from './helpers/config-helper';

dotenv.config({
  path: path.join(
    process.cwd(),
    `.env.${
      process.env.NODE_ENV && process.env.NODE_ENV.length > 0
        ? process.env.NODE_ENV
        : 'development'
    }`,
  ),
});
export const config = {
  node: ConfigHelper.getOsEnv('NODE_ENV') || 'development',
  isProduction: ConfigHelper.getOsEnv('NODE_ENV') === 'production',
  isTest: ConfigHelper.getOsEnv('NODE_ENV') === 'test',
  isDevelopment: ConfigHelper.getOsEnv('NODE_ENV') === 'development',
  app: {
    name: ConfigHelper.getOsEnv('APP_NAME'),
    version: (pkg as any).version,
    description: (pkg as any).description,
    host: ConfigHelper.getOsEnv('APP_HOST'),
    port: ConfigHelper.normalizePort(
      process.env.PORT || ConfigHelper.getOsEnv('APP_PORT'),
    ),
  },
  jwt: {
    secret: ConfigHelper.getOsEnv('JWT_SECRET'),
    expiresIn: ConfigHelper.getOsEnv('JWT_EXPIRES_IN'),
    refreshTokenSecret: ConfigHelper.getOsEnv('JWT_REFRESH_TOKEN_SECRET'),
    refreshTokenExpiresIn: ConfigHelper.getOsEnv(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    ),
  },
  db: {
    type: ConfigHelper.getOsEnv('DB_CONNECTION'),
    host: ConfigHelper.getOsEnvOptional('DB_HOST'),
    port: ConfigHelper.toNumber(ConfigHelper.getOsEnvOptional('DB_PORT')),
    username: ConfigHelper.getOsEnvOptional('DB_USERNAME'),
    password: ConfigHelper.getOsEnvOptional('DB_PASSWORD'),
    database: ConfigHelper.getOsEnv('DB_DATABASE'),
    logging: ConfigHelper.getOsEnv('DB_LOGGING') === 'true',
    migrations: ConfigHelper.getOsPathList('DB_MIGRATIONS'),
    entities: ConfigHelper.getOsPathList('DB_ENTITIES'),
  },
  amqp: {
    hostname: ConfigHelper.getOsEnv('AMQP_HOSTNAME'),
    queue: ConfigHelper.getOsEnv('AMQP_QUEUE'),
    user: ConfigHelper.getOsEnv('AMQP_USER'),
    password: ConfigHelper.getOsEnv('AMQP_PASSWORD'),
  },
  redis: {
    url: ConfigHelper.getOsEnv('REDIS_URL'),
  },
  // mailer: {
  //     service: ConfigHelper.getOsEnv('MAILER_SERVICE'),
  //     user: ConfigHelper.getOsEnv('MAILER_USER'),
  //     pass: ConfigHelper.getOsEnv('MAILER_PASS'),
  //     defaultEmail: ConfigHelper.getOsEnv('MAILER_DEFAULT_EMAIL')
  // },
  swagger: {
    enabled: ConfigHelper.toBool(ConfigHelper.getOsEnv('SWAGGER_ENABLED')),
    route: ConfigHelper.getOsEnv('SWAGGER_ROUTE'),
  },
};

export enum VirtualWorker {
  FORM_BOT = 'FORM_BOT',
}

export interface VirtualWorkerSettings {
  formId: number;
  subscriberId: number;
}
