import { Knex } from "knex"
import { assert, should, expect } from "chai";
import { PlayModel } from "../../dbModels/plays"
import { PlayFetchingModel } from "../../fetchingModels/plays"
import { PlayBaseInterface, PlayQueryInterface, PlayWithPosterInterface } from "../../interfaces/plays"
class PlayMockModel implements PlayModel {
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
        for (let play of this.playsList) {
            if (payload.id && play.id === payload.id) {
                return play
            }
            else if (payload.id === 500) {
                throw "Database mock error"
            }
        }
        return undefined
    }

    insert(trx: Knex.Transaction, payload: PlayBaseInterface) {
        if (payload.title === "fail") { 
            throw "Database mock error"
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
        return
    }

    delete(trx: Knex.Transaction, id: number) {
        return
    }

    getAllWithPoster(payload: PlayQueryInterface) {
        return this.getAll(payload)
    }

    getSingleWithPoster(payload: PlayQueryInterface) {
        return this.get(payload)
    }
}


export function PlayServiceTests() {
    describe("Play Service", () => {
        const playMockModel = new PlayMockModel()
        const playService = new PlayFetchingModel(playMockModel)

        describe("Get All With Poster", function() {
            it("should be OK", async function() {
                const response = await playService.getAll()

                expect(response).to.eql(playMockModel.playsList)
            })
        })
        describe("Get Single Play", function() {
            it("should be OK", async function() {
                const response = await playService.getSinglePlay(1)

                expect(response).to.eql(playMockModel.playsList[0])
            })

            it("should be inner error 404", async function() {
                const response = await playService.getSinglePlay(114)

                expect(response).to.haveOwnProperty("code").that.equals(404)
                expect(response).to.haveOwnProperty("message")
            })

            it("should be inner error 500", async function() {
                const response = await playService.getSinglePlay(500)

                expect(response).to.haveOwnProperty("code").that.equals(500)
                expect(response).to.haveOwnProperty("message")
            })
        })
        describe("Create Play", function() {
            it("should be OK (return inserted value with id)", async function() {
                const response = await playService.createPlay({
                    title: "for test insert 1", 
                    description: "for test insert 1"
                })

                expect(response).to.haveOwnProperty("id").that.equals(playMockModel.playsList.length)
                expect(response).to.haveOwnProperty("title").that.equals("for test insert 1")
                expect(response).to.haveOwnProperty("description").that.equals("for test insert 1")
            })

            it("should return inner error with status 500", async function() {
                const response = await playService.createPlay({
                    title: "fail", 
                    description: "for test insert 1"
                })

                expect(response).to.haveOwnProperty("code").that.equals(500)
                expect(response).to.haveOwnProperty("message")
            })
        })
    })
}