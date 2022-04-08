export interface ErrorInterface {
    message: string
}

export interface InnerErrorInterface extends ErrorInterface{
    code: number
}

export function isInnerErrorInterface(obj: any): obj is InnerErrorInterface {
    return obj 
        && obj.code && typeof obj.code === 'number' 
        && obj.message && typeof obj.message === 'string'
}