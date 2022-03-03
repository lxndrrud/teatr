import { KnexConnection }from "../knex/connections"
import { Request, Response } from "express"

export const getPlays = async (req: Request, res: Response) => {
    let query = await KnexConnection('plays')
    res.send(query)
}