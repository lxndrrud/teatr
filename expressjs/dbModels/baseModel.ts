import { Knex } from "knex";

export abstract class DatabaseModel {
    protected tableName: string
    protected connection

    constructor(tableName: string, connectionInstance: Knex<any, unknown[]>) {
        this.tableName = tableName
        this.connection = connectionInstance
    }

    abstract getAll(payload: any): any
    abstract get(payload: any): any
    abstract insert(trx: Knex.Transaction, payload: any): any
    abstract update(trx: Knex.Transaction, id: number, payload: any): any
    abstract delete(trx: Knex.Transaction, id:number): any
    
}