export interface ErrorInterface {
    message: string
}

export interface InnerErrorInterface extends ErrorInterface{
    code: number
}

export function isInnerErrorInterface(obj: any): obj is InnerErrorInterface {
    return 'code' in obj && 'message' in obj
}