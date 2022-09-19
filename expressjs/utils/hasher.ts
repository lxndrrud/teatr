import bcrypt from 'bcryptjs'


export interface IHasher {
    hash(toHash: string): Promise<string>
    check(toCompare: string, hash: string): boolean
}

export class Hasher implements IHasher {
    private hashLib
    constructor() {
        this.hashLib = bcrypt
    }

    public hash(toHash: string) {
        return this.hashLib.hash(toHash, 10) 
    }

    public check(toCompare: string, hash: string) {
        return this.hashLib.compareSync(toCompare, hash)
    }
}