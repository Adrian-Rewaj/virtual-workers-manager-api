import { DataSource } from 'typeorm';
import { config } from '../common/config';

const dataSource = new DataSource({
  type: config.db.type as any,
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: false,
  logNotifications: config.db.logging,
  entities: config.db.entities,
  migrations: config.db.migrations,
});

export default dataSource;
