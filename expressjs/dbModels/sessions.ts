import { Model } from "objection"
import { config } from "../knexfile.type"
import knex from "knex"
import { Play } from "./plays"
import { sessions, plays } from "./tables"

Model.knex(knex(config.main))

export class Session extends Model {
    static get tableName() {
        return sessions
    }

    static get relationMappings() {
        return {
            play: {
                relation: Model.BelongsToOneRelation,
                modelClass: Play,
                join: {
                    from: `${plays}.id`,
                    to: `${sessions}.id_play`
                }
            }
        }
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['title', 'description'],
            properties: {
                id: { type: 'integer' },
                title: { type: 'string'},
                description: { type: 'string' }
            }
        }
    }
}
