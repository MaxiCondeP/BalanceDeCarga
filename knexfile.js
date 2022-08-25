import dotenv from 'dotenv';
dotenv.config();

const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
const DATABASE_PORT = process.env.DATABASE_PORT || "3306";
const DATABASE_USER = process.env.DATABASE_USER || "root";
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
const DATABASE_NAME = process.env.DATABASE_NAME || "ecommerce-db";

console.log(DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD);
let  knexConfig = {
    client: 'mysql',
    connection: {
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        user: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_NAME
    },
    migrations: {
        tablename: 'knex_migrations',
        directory: './knex/migrations'
    },
    seeds: {
        tableName: 'knex_seeds',
        directory: './knex/seeds'
    }
}

export default knexConfig;
