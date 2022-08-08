import bcrypt from 'bcryptjs'


export class Hasher {
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