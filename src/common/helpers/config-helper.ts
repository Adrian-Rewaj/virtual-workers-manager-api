import { join } from 'path';

export class ConfigHelper {
  public static getOsEnv(key: string): string {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} is not set.`);
    }

    return process.env[key] || '';
  }

  public static getOsEnvOptional(key: string): string {
    return process.env[key] || '';
  }

  public static getPath(path: string): string {
    return process.env.NODE_ENV === 'production'
      ? join(process.cwd(), path.replace('src/', 'dist/').slice(0, -3) + '.js')
      : join(process.cwd(), path);
  }

  public static getPathList(paths: string[]): string[] {
    return paths.map((p) => ConfigHelper.getPath(p));
  }

  public static getOsPath(key: string): string {
    return ConfigHelper.getPath(ConfigHelper.getOsEnv(key));
  }

  public static getOsPathList(key: string): string[] {
    return ConfigHelper.getPathList(ConfigHelper.getOsEnvArray(key));
  }

  public static getOsEnvArray(key: string, delimiter: string = ','): string[] {
    if (!process.env[key]) {
      return [];
    }

    return process.env[key]?.split(delimiter) || [];
  }

  public static toNumber(value: string): number {
    return parseInt(value, 10);
  }

  public static toBool(value: string): boolean {
    return value === 'true';
  }

  public static normalizePort(port: string): number | string {
    const parsedPort = parseInt(port, 10);

    if (isNaN(parsedPort)) {
      return port;
    }

    if (parsedPort >= 0) {
      return parsedPort;
    }

    throw new Error(`Invalid port`);
  }
}
