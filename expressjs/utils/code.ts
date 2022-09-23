export interface ICodeGenerator {
    generateCode(): string
}

export class CodeGenerator {
    private randomInt() {
        return Math.floor(Math.random() * 9);
    }

    public generateCode() {
        let code = ''
        for (let i=0; i < 6; i++) {
            code += this.randomInt().toString()
        }
        return code
    }
}