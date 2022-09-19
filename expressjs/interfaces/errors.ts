export interface ErrorInterface {
    message: string
}

export interface InnerErrorInterface extends ErrorInterface{
    code: number
}

export class InnerError extends Error {
    public code
    constructor(message: string, code: number) {
        super(message)
        this.message = message
        this.code = code
    }
}

export function isInnerErrorInterface(obj: any): obj is InnerErrorInterface {
    return obj 
        && obj.code && typeof obj.code === 'number' 
        && obj.message && typeof obj.message === 'string'
}