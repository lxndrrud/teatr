
export class Auditorium {
    private id
    private title

    constructor(payload: { id?: number, title: string }) {
        if(payload.id) this.id = payload.id
        this.title = payload.title
    }

    
}