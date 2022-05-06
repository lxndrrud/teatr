import { Knex } from "knex"
import { PlayModel } from "../../dbModels/plays"
import { PlayBaseInterface, PlayQueryInterface, PlayWithPosterInterface } from "../../interfaces/plays"


export class PlayMockModel implements PlayModel {
    public playsList: PlayWithPosterInterface[] 
    constructor() {
        this.playsList = [
            {
                id: 1,
                title: "Test 1",
                description: "Test description 1",
                poster_filepath: "poster_filepath 1"
            },
            {
                id: 2,
                title: "Test 2",
                description: "Test description 2",
                poster_filepath: "poster_filepath 2"
            }
        ]
    }

    getAll(payload: PlayQueryInterface) {
        return this.playsList
    }

    get(payload: PlayQueryInterface) {
        if (payload.id === 500) {
            throw new Error("Database mock error")
        }
        for (let play of this.playsList) {
            if (payload.id && play.id === payload.id) {
                return play
            }
        }
        return undefined
    }

    insert(trx: Knex.Transaction, payload: PlayBaseInterface) {
        if (payload.title === "fail") { 
            throw new Error("Database mock error")
        }
        const newPlay = {
            id: this.playsList.length + 1,
            title: payload.title,
            description: payload.description,
            poster_filepath: "test insert" 
        }
        this.playsList.push(newPlay)
        return [newPlay]
    }

    update(trx: Knex.Transaction, id: number, payload: {
        title?: string,
        description?: string
    }) {
        if (id === 500) throw new Error("Database mock error")
        for (const play of this.playsList) {
            if (play.id === id) {
                if (payload.description) play.description = payload.description
                if (payload.title) play.title = payload.title
            }
        }
    }

    delete(trx: Knex.Transaction, id: number) {
        if (id === 500) throw "Database mock error"
        for (let i=0; i<this.playsList.length; i++) {
            if (this.playsList[i].id === id) {
                this.playsList.splice(i, 1)
            }
        }
    }

    getAllWithPoster(payload: PlayQueryInterface) {
        return this.getAll(payload)
    }

    getSingleWithPoster(payload: PlayQueryInterface) {
        return this.get(payload)
    }
}