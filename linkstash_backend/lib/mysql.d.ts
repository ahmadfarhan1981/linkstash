import type { Knex } from 'knex';
import type { Application } from './declarations';
declare module './declarations' {
    interface Configuration {
        mysqlClient: Knex;
    }
}
export declare const mysql: (app: Application) => void;
