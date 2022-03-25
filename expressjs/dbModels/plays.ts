import { Model } from "objection"
import { config } from "../knexfile.type"
import knex from 'knex'
import { plays } from "./tables"

Model.knex(knex(config.main))

export class Play extends Model {
    static get tableName() {
        return plays
    }
    
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['title', 'description'],
            properties: {
                id: { type: 'integer' },
                title: { type: 'string'},
                description: { type: 'string' },
            }
        }
    }
}