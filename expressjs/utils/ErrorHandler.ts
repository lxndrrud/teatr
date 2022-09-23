import { Response } from 'express'
import { InnerError, ErrorInterface } from '../interfaces/errors' 

export interface IErrorHandler {
    fetchError(response: Response, error: any): void
}

export class ErrorHandler implements IErrorHandler {
    public fetchError(response: Response, error: any) {
        if (error instanceof InnerError ) {
            console.error(error)
            response.status(error.code).send(<ErrorInterface>{
                message: error.message
            })
        } else {
            console.error(error)
            response.status(500).send(<ErrorInterface> {
                message: error
            })
        }
    }
}