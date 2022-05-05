import {PlayInterface, PlayWithPosterInterface} from "../interfaces/plays"

export class Play {
    private id
    private title
    private description
    private poster_filepath

    constructor(payload: { id?: number, title: string, description: string, posterFilepath?: string}) {
        if (payload.id) this.id = payload.id
        this.title = payload.title
        this.description = payload.description
        if (payload.posterFilepath) this.poster_filepath = payload.posterFilepath
    }

    public getPlayInterface() {
        if (this.id)
            return <PlayInterface>{
                id: this.id,
                title: this.title,
                description: this.description
            }
    }

    public getPlayWithPosterInterface() {
        if (this.id && this.poster_filepath) 
            return <PlayWithPosterInterface>{
                id: this.id,
                title: this.title,
                description: this.description,
                poster_filepath: this.poster_filepath
            }
    }

}