import { JwtPayload, Secret, sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import 'dotenv/config'

export interface ITokenizer {
    sign(payload: string | object | Buffer, options?: SignOptions | undefined): string
    verify(token: string, options?: (VerifyOptions & {
        complete?: false | undefined;
    }) | undefined): string | JwtPayload
}


export class Tokenizer implements ITokenizer {
    private signFunction
    private verifyFunction
    private secretKey

    constructor() {
        this.signFunction = sign
        this.verifyFunction = verify
        this.secretKey = `${process.env.SECRET_KEY}`
    }

    public verify(token: string, options?: (VerifyOptions & {
        complete?: false | undefined;
    })) {
        return this.verifyFunction(token, this.secretKey, options)
    }

    public sign(payload: string | object | Buffer, options?: SignOptions | undefined) {
        return this.signFunction(payload, this.secretKey, options)
    }
}