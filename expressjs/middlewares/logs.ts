import { Request, Response, NextFunction } from "express"

export const logger = (req: Request, res: Response, next: NextFunction) => {
    let toConsole: string = `${req.path}`

    if (req.user) {
        console.log(toConsole + ' user: ' + req.user)
    }
    
    if (req.params) {
        toConsole = toConsole + ' params: ' + req.params
    }

    if (req.query) {
        toConsole = toConsole + ' query: ' + req.query
    }

    if (req.body) {
        toConsole = toConsole + ' body: ' + req.body
    }

    console.log(toConsole)

    next()
}