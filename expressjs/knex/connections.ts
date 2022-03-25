import knex, { Knex } from "knex"
import { config } from "../knexfile.type"

export const KnexConnection = knex(config.main)