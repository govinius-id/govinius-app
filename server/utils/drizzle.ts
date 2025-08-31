import type { H3Event } from 'h3';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { MySqlTransaction } from 'drizzle-orm/mysql-core';
import type {
  MySql2Database,
  MySql2PreparedQueryHKT,
  MySql2QueryResultHKT,
} from 'drizzle-orm/mysql2';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

let connection: mysql.Pool | null;

type DatabaseConnection = MySql2Database<Record<string, never>> & {
  $client: mysql.Pool;
};

type DatabaseTransaction = MySqlTransaction<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

const runtimeConfig = useRuntimeConfig();

export const $drizzle = (
  event: H3Event,
): DatabaseConnection | DatabaseTransaction => {
  if (event.context?.tx) return event.context?.tx;

  if (!connection) {
    try {
      connection = mysql.createPool({
        host: runtimeConfig.mysqlHost,
        port: +runtimeConfig.mysqlPort,
        user: runtimeConfig.mysqlUser,
        password: runtimeConfig.mysqlPassword,
        database: runtimeConfig.mysqlDatabase,
        connectionLimit: 10,
        queueLimit: 0,
        waitForConnections: true,
        connectTimeout: 10000,
      });
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: $i18n(event).t('message.error_database_connection'),
        data: error,
      });
    }
  }

  return drizzle({ client: connection });
};

const endConnection = async () => {
  if (connection) {
    await connection.end();
    connection = null;
  }
  process.exit(0);
};

process.on('SIGINT', endConnection);
process.on('SIGTERM', endConnection);
