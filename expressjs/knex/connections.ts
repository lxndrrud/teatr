import knex from "knex"
import { config } from "../knexfile.type"

export const KnexConnection = knex(config.main)