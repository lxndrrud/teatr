import { Knex } from "knex"
import { assert, should, expect } from "chai";
import { PlayModel } from "../../dbModels/plays"
import { PlayFetchingModel } from "../../services/plays"
import { PlayBaseInterface, PlayQueryInterface, PlayWithPosterInterface } from "../../interfaces/plays"
import { PlayMockModel } from "../mockModels/plays";


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
        describe("Update Play", function() {
            const goodPayload: PlayBaseInterface = {
                title: "Test update",
                description: "Test update"
            }
            it("should be OK", async function() {
                const response = await playService.updatePlay(1, goodPayload)

                expect(response).to.equal(undefined)
                expect(playMockModel.playsList[0].title).to.equal(goodPayload.title)
                expect(playMockModel.playsList[0].description).to.equal(goodPayload.description)
            })

            it("should return inner error 404", async function() {
                const response = await playService.updatePlay(114, goodPayload)

                expect(response).to.haveOwnProperty("code").that.equals(404)
            })

            it("should return inner error 500", async function() { 
                const response = await playService.updatePlay(500, goodPayload)

                expect(response).to.haveOwnProperty("code").that.equals(500)
            })
        })
        describe("Delete Play", function() {
            it("should be OK", async function() {
                const lengthBefore = playMockModel.playsList.length
                const response = await playService.deletePlay(1)

                expect(response).to.equal(undefined)
                expect(playMockModel.playsList.length).to.equal(lengthBefore-1)
            })

            it("should return inner error 404", async function() {
                const lengthBefore = playMockModel.playsList.length
                const response = await playService.deletePlay(114)

                expect(response).to.haveOwnProperty("code").that.equals(404)
                expect(playMockModel.playsList.length).to.equal(lengthBefore)
            })

            it("should return inner error 500", async function() {
                const lengthBefore = playMockModel.playsList.length
                const response = await playService.deletePlay(500)

                expect(response).to.haveOwnProperty("code").that.equals(500)
                expect(playMockModel.playsList.length).to.equal(lengthBefore)
            })
        })
    })
}