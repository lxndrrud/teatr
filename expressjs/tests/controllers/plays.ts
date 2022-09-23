import { assert, should, expect } from "chai";
import { agent as request } from "supertest";
import { PlayBaseInterface } from "../../interfaces/plays";
import { KnexConnection } from "../../knex/connections";
import fs from "fs"

export function PlaysControllerTests () {
    describe("Plays contoller", () => {
        before(async function() {
            await KnexConnection.migrate.rollback()
            await KnexConnection.migrate.latest()
            await KnexConnection.seed.run()

            const tokenResponse = await request(this.server)
                .post(this.authLink)
                .send({
                    email: "admin@admin.ru",
                    password: "123456"
                })
            this.token = tokenResponse.body.token

            const visitorTokenResponse = await request(this.server)
                .post(this.authLink)
                .send({
                    email: "lxndrrud@yandex.ru",
                    password: "123456"
                })
            this.visitorToken = visitorTokenResponse.body.token

            const cashierTokenResponse = await request(this.server)
                .post(this.authLink)
                .send({
                    email: "kassir@mail.ru",
                    password: "123456"
                })
            this.cashierToken = cashierTokenResponse.body.token
        })

        describe("GET /expressjs/plays/", function() {
            const getPlaysLink = `/expressjs/plays/`
            it("should be status 200 with info", async function() {
                const response = await request(this.server).get(getPlaysLink)
                expect(response.status).to.equal(200)
                expect(response.body.length).to.be.greaterThan(0)
                expect(response.body[0]).to.haveOwnProperty('id')
                expect(response.body[0]).to.haveOwnProperty('crew')
                expect(response.body[0]).to.haveOwnProperty('title')
                expect(response.body[0]).to.haveOwnProperty('description')
                expect(response.body[0]).to.haveOwnProperty('poster_filepath')
            })
        })
        
        describe("GET /expressjs/plays/1", function() {
            const getPlayLink = `/expressjs/plays/1`
            const failGetPlayLink = `/expressjs/plays/114`
            it("should be status 200 with info", async function() {
                const response = await request(this.server).get(getPlayLink)
                expect(response.status).to.equal(200)
                expect(response.body).to.haveOwnProperty('id')
                expect(response.body).to.haveOwnProperty('crew')
                expect(response.body).to.haveOwnProperty('title')
                expect(response.body).to.haveOwnProperty('description')
                expect(response.body).to.haveOwnProperty('poster_filepath')
            })
            it("should be status 404", async function() {
                const response = await request(this.server).get(failGetPlayLink)
                expect(response.status).to.equal(404)
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
                    .set({
                        'auth-token': this.token
                    })
                    .send(postPayload)
                
                expect(response.status).to.equal(201)
            })

            it("should fail because of payload", async function () {
                const response = await request(this.server)
                    .post(postPlayLink)
                    .set({
                        'auth-token': this.token
                    })
                    .send({
                        title: postPayload.title
                    })
                
                expect(response.status).to.equal(400)
            })
        })

        describe("PUT /expressjs/plays/1", function() {
            const updatePayload: PlayBaseInterface = {
                title: "test",
                description: "test",
            }
            const updatePlayLink = `/expressjs/plays/1`
            const failUpdatePlayLink = `/expressjs/plays/114`
            

            it("should have 404 status because wrong idPlay", async function () {
                const response = await request(this.server)
                    .put(failUpdatePlayLink)
                    .set({
                        'auth-token': this.token
                    })
                    .send(updatePayload)
                
                expect(response.status).to.equal(404)
            })

            it("should have 400 status because wrong payload", async function () {
                const response = await request(this.server)
                    .put(updatePlayLink)
                    .set({
                        'auth-token': this.token
                    })
                    .send({
                        title: updatePayload.title
                    })
                
                expect(response.status).to.equal(400)
            })

            it("should have 403 status because without token", async function() {
                const response = await request(this.server)
                    .put(updatePlayLink)
                    .send({
                        title: updatePayload.title
                    })
                
                expect(response.status).to.equal(403)
            })

            it("should be OK", async function () {
                const response = await request(this.server)
                    .put(updatePlayLink)
                    .set({
                        'auth-token': this.token
                    })
                    .send(updatePayload)
                
                expect(response.status).to.equal(200)
            })
        })

        describe("DELETE /expressjs/plays/1", function() {
            const deleteLink = `/expressjs/plays/1`
            const failDeleteLink = `/expressjs/plays/114`
            
            it("should have status 403 because without token", async function() {
                const response = await request(this.server)
                    .delete(failDeleteLink)

                expect(response.status).to.equal(403)
            })

            it("should have status 404", async function() {
                const response = await request(this.server)
                    .delete(failDeleteLink)
                    .set({
                        'auth-token': this.token
                    })

                expect(response.status).to.equal(404)
            })

            it("should be OK", async function() {
                const response = await request(this.server)
                    .delete(deleteLink)
                    .set({
                        'auth-token': this.token
                    })

                expect(response.status).to.equal(200)
            })
        })

        describe("POST /expressjs/plays/csv", function() {
            const postPlaysCSVLink = `/expressjs/plays/csv/`
            it("should fail because of invalid csv file", async function() {
                const response = await request(this.server)
                    .post(postPlaysCSVLink)
                    .set({
                        'auth-token': this.token, 
                        'content-type': 'multipart/form-data'
                    })
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/plays/test_plays_FAIL.csv"), 
                        "test_plays.csv")

                expect(response.statusCode).to.equal(400)
            })

            it('should return 403 status code for visitor', async function() {
                const response = await request(this.server)
                    .post(postPlaysCSVLink)
                    .set({
                        'auth-token': this.visitorToken, 
                        'content-type': 'multipart/form-data'
                    })
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/plays/test_plays_OK.csv"), 
                        "test_plays.csv")

                expect(response.statusCode).to.equal(403)
            })

            it('should return 403 status code for cashier', async function() {
                const response = await request(this.server)
                    .post(postPlaysCSVLink)
                    .set({
                        'auth-token': this.cashierToken, 
                        'content-type': 'multipart/form-data'
                    })
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/plays/test_plays_OK.csv"), 
                        "test_plays.csv")

                expect(response.statusCode).to.equal(403)
            })

            it("should fail because request is sent without file", async function() {
                const response = await request(this.server)
                    .post(postPlaysCSVLink)
                    .set({
                        'auth-token': this.token, 
                        'content-type': 'multipart/form-data'
                    })
                    /*
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/plays/test_plays_FAIL.csv"), 
                        "test_plays.csv")
                        */

                expect(response.statusCode).to.equal(400)
            })

            it("should fail (403) because request is sent without token", async function() {
                const response = await request(this.server)
                    .post(postPlaysCSVLink)
                    .set({
                        'content-type': 'multipart/form-data'
                    })
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/plays/test_plays_FAIL.csv"), 
                        "test_plays.csv")

                expect(response.statusCode).to.equal(403)
            })

            it("should be OK", async function() {
                const response = await request(this.server)
                    .post(postPlaysCSVLink)
                    .set({
                        'auth-token': this.token, 
                        'content-type': 'multipart/form-data'
                    })
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/plays/test_plays_OK.csv"), 
                        "test_plays.csv")

                expect(response.statusCode).to.equal(201)
            })
        })
    })

}

