import { assert, should, expect } from "chai";
import { agent as request } from "supertest";
import { PlayBaseInterface } from "../../interfaces/plays";
import { KnexConnection } from "../../knex/connections";

export function PlaysControllerTests () {
    describe("Plays contoller", () => {
        before(async function() {
            await KnexConnection.migrate.rollback()
            await KnexConnection.migrate.latest()
            await KnexConnection.seed.run()
        })

        describe("GET /expressjs/plays/", function() {
            const getPlaysLink = `/expressjs/plays/`
            it("should be status 200 with info", async function() {
                const response = await request(this.server).get(getPlaysLink)
                expect(response.status).to.equal(200)
                expect(response.body.length).to.equal(2)
                expect(response.body[0]).to.eql({
                    id: 1,
                    title: 'Спектакль 1',
                    description: 'Тестовый спектакль 1',
                    poster_filepath: '/expressjs/storage/photos/photo1.jpg'
                })
            })
        })
        describe("GET /expressjs/plays/1", function() {
            const getPlayLink = `/expressjs/plays/1`
            const failGetPlayLink = `/expressjs/plays/114`
            it("should be status 200 with info", async function() {
                const response = await request(this.server).get(getPlayLink)
                expect(response.status).to.equal(200)
                expect(response.body).to.eql({
                    id: 1,
                    title: 'Спектакль 1',
                    description: 'Тестовый спектакль 1',
                    poster_filepath: '/expressjs/storage/photos/photo1.jpg'
                })
            })
            it("should be status 404", async function() {
                const response = await request(this.server).get(failGetPlayLink)
                expect(response.status).to.equal(404)
                expect(response.body).to.eql({ 
                    message: 'Спектакль не найден!' 
                })
            })
        })

        describe("POST /expressjs/plays/", function() {
            const postPayload: PlayBaseInterface = {
                title: "test",
                description: "test",
            }
            const postPlayLink = `/expressjs/plays/`
            it("should be ok and return new play id", async function() {
                const response = await request(this.server)
                    .post(postPlayLink)
                    .send(postPayload)
                
                expect(response.status).to.equal(201)
                expect(response.body).to.eql({
                    id: 3
                })
            })

            it("should fail because of payload", async function () {
                const response = await request(this.server)
                    .post(postPlayLink)
                    .send({
                        title: postPayload.title
                    })
                
                expect(response.status).to.equal(400)
            })
        })

        describe("GET /expressjs/plays/1", function() {
            const getPlayLink = `/expressjs/plays/1`
            const failGetPlayLink = `/expressjs/plays/114`
            const failGetPlayLinkBadRequest = `/expressjs/plays/`
            it("should be OK", async function() {
                const response = await request(this.server)
                    .get(getPlayLink)

                expect(response.status).to.equal(200)
            })

            it("should have 404 status", async function () {
                const response = await request(this.server)
                    .get(failGetPlayLink)

                expect(response.status).to.equal(404)
            })
        })

        describe("PUT /expressjs/plays/1", function() {
            const updatePayload: PlayBaseInterface = {
                title: "test",
                description: "test",
            }
            const updatePlayLink = `/expressjs/plays/1`
            const failUpdatePlayLink = `/expressjs/plays/114`
            it("should be OK", async function () {
                const response = await request(this.server)
                    .put(updatePlayLink)
                    .send(updatePayload)
                
                expect(response.status).to.equal(200)
            })

            it("should have 404 status because wrong idPlay", async function () {
                const response = await request(this.server)
                    .put(failUpdatePlayLink)
                    .send(updatePayload)
                
                expect(response.status).to.equal(404)
            })

            it("should have 400 status because wrong payload", async function () {
                const response = await request(this.server)
                    .put(updatePlayLink)
                    .send({
                        title: updatePayload.title
                    })
                
                expect(response.status).to.equal(400)
            })
        })

        describe("DELETE /expressjs/plays/1", function() {
            const deleteLink = `/expressjs/plays/1`
            const failDeleteLink = `/expressjs/plays/114`
            it("should be OK", async function() {
                const response = await request(this.server)
                    .delete(deleteLink)

                expect(response.status).to.equal(200)
            })

            it("should have status 404", async function() {
                const response = await request(this.server)
                    .delete(failDeleteLink)

                expect(response.status).to.equal(404)
            })
        })

        

        
    })

}

