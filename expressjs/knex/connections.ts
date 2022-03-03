import knex from "knex"
import { main } from "../knexfile.js"

export const KnexConnection = knex(main)