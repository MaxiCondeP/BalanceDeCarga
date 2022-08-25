import knex from 'knex';
import knexConfig from '../knexfile.js';

const db = knex(knexConfig);


export class dbManager {
    constructor(tablename) {
        this.tableName = tablename;
    }

    async getAll() {
        try {
            let data = await db(this.tableName).select('*');
            return data;
        } catch (err) {
            return err;
        }

    }

    async addRecord(data) {
        try {
            await db(this.tableName).insert(data)
            console.log(this.tableName)
        } catch (err) {
            return err;
        }
    }



}
