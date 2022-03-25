import { KnexConnection } from "../knex/connections";
import { Knex } from "knex";

export abstract class DatabaseModel {
    protected connection: Knex<any, unknown[]>
    protected tableName: string

    constructor(connection: Knex<any, unknown[]>, tableName: string) {
        if (connection)
            this.connection = connection
        else 
            this.connection = KnexConnection
        this.tableName = tableName
    }

    abstract getAll(payload: any): any
    abstract get(payload: any): any
    abstract insert(payload: any): any
    abstract update(id: number, payload: any): any
    abstract delete(id:number): any
    
}