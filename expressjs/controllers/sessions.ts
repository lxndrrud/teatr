import { Request, Response } from "express"
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface, isSessionBaseInterface, isSessionFilterQueryInterface } 
    from "../interfaces/sessions"
import { SessionFetchingInstance } from "../fetchingModels/sessions"
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors"


export const getSessions = async (req: Request, res: Response) => {
    const query = await SessionFetchingInstance.getUnlockedSessions()
    if (isInnerErrorInterface(query)) {
        res.status(query.code).send(<ErrorInterface>{
            message: query.message
        })
        return
    }
    res.status(200).send(query)
}

export const getSingleSession = async (req: Request, res: Response) => {
    const idSession = parseInt(req.params.idSession)
    if (!idSession) {
        res.status(400).end()
        return 
    }
    const query = await SessionFetchingInstance.getSingleUnlockedSession(idSession)
    if (isInnerErrorInterface(query)) {
        res.status(query.code).send(<ErrorInterface>{
            message: query.message
        })
        return
    }
    res.status(200).send(query)
}

export const postSession = async (req: Request, res: Response) => {
    if (!isSessionBaseInterface(req.body)) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    const payload: SessionBaseInterface = {...req.body}
    const newSession = await SessionFetchingInstance.createSession(payload)
    if (isInnerErrorInterface(newSession)) {
        res.status(newSession.code).send(<ErrorInterface>{
            message: newSession.message
        })
        return
    }
    res.status(201).send({
        id: newSession.id
    })
}

export const updateSession = async (req: Request, res: Response) => {
    const idSession = parseInt(req.params.idSession)
    if (!idSession) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    if (!isSessionBaseInterface(req.body)) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    const payload: SessionBaseInterface = {...req.body}
    
    const response = await SessionFetchingInstance.updateSession(idSession, payload)
    if (isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }
    res.status(200).end()
}

export const deleteSession = async (req: Request, res: Response) => {
    const idSession = parseInt(req.params.idSession)
    if (!idSession) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    const response = await SessionFetchingInstance.deleteSession(idSession)

    if (isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }

    res.status(200).end()
}

export const getSessionsByPlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    if (!idPlay) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return 
    }
    
    const query = await SessionFetchingInstance.getSessionsByPlay(idPlay)

    if (isInnerErrorInterface(query)) {
        res.status(query.code).send(<ErrorInterface>{
            message: query.message
        })
        return
    }

    res.status(200).send(query)
}

export const getSlotsForSessions = async (req: Request, res: Response) => {
    const idSession = parseInt(req.params.idSession)
    if (!idSession) {
        res.status(400).end()
        return
    }
    const result = await SessionFetchingInstance.getSlots(idSession)

    if (isInnerErrorInterface(result)) {
        res.status(result.code).send(<ErrorInterface>{
            message: result.message
        })
        return
    }

    res.status(200).send(result)
}

export const getFilteredSessions = async (req: Request, res: Response) => {
    if (!isSessionFilterQueryInterface(req.query)) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    const userQuery: SessionFilterQueryInterface = {...req.query}

    const query = await SessionFetchingInstance.getFilteredSessions(userQuery)

    if (isInnerErrorInterface(query)) {
        res.status(query.code).send(<ErrorInterface>{
            code: query.code,
            message: query.message
        })
        return
    }

    res.status(200).send(query)
}

export const getSessionFilterOptions = async (req: Request, res: Response) => {
    const query = await SessionFetchingInstance.getSessionFilterOptions()

    if (isInnerErrorInterface(query)) {
        res.status(query.code).send(<ErrorInterface>{
            message: query.message
        })
        return
    }

    res.status(200).send(query)
}