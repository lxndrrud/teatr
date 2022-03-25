import knex, { Knex } from "knex"
import { config } from "../knexfile.type"
import { Model }  from "objection"

export const KnexConnection = knex(config.main)
export const model = Model.knex(knex(config.main))