import { assert, should, expect } from "chai";
import moment from "moment";
import { agent as request } from "supertest";
import { SessionBaseInterface, SessionDatabaseInterface, SessionFilterQueryInterface } from "../../interfaces/sessions";
import { KnexConnection } from "../../knex/connections";
import { timestampFromMoment } from "../../utils/timestamp";


export function SessionsControllerTest() {
    describe("Sessions Controller", () => {
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
        })
        describe("GET /expressjs/sessions/", function() {
            const getSessionsLink = `/expressjs/sessions`
            it("should be OK", async function() {
                const response = await request(this.server)
                    .get(getSessionsLink)

                expect(response.status).to.equal(200)
                expect(response.body.length)
                    .to.be.greaterThanOrEqual(1)
            })
        })

        describe("POST /expressjs/sessions/", function() {
            const postLink = `/expressjs/sessions`
            const postPayload: SessionBaseInterface = {
                id_play: 2,
                id_price_policy: 2,
                is_locked: false,
                timestamp: timestampFromMoment(moment()),
                max_slots: 10
            }
            const failPostPayload = {
                id_price_policy: 2,
                is_locked: false,
                timestamp: timestampFromMoment(moment())
            }

            it("should be 201 CREATED", async function () {
                const response = await request(this.server)
                    .post(postLink)
                    .set({
                        'auth-token': this.token
                    })
                    .send(postPayload)

                expect(response.status).to.equal(201)
            })

            it("should have status 403", async function () {
                const response = await request(this.server)
                    .post(postLink)
                    .send(postPayload)

                expect(response.status).to.equal(403)
            })

            it("should have status 400", async function () {
                const response = await request(this.server)
                    .post(postLink)
                    .set({
                        'auth-token': this.token
                    })
                    .send(failPostPayload)

                expect(response.status).to.equal(400)
            })
        })

        describe("GET /expressjs/sessions/3", function() {
            const getSessionLink = `/expressjs/sessions/3`
            const failSessionLink = `/expressjs/sessions/114`
            it("should be OK", async function() {
                const response = await request(this.server)
                    .get(getSessionLink)
                    .set({
                        "auth-token": this.token
                    })

                expect(response.status).to.equal(200)
                expect(response.body).to.eql({
                    id: 3,
                    is_locked: false,
                    timestamp: 'вторник, 21 июня 2022 г., 7:30',
                    max_slots: 5,
                    id_play: 2,
                    id_price_policy: 2,
                    auditorium_title: 'Малая сцена',
                    play_title: 'Спектакль 2',
                    poster_filepath: '/expressjs/storage/photos/photo2.jpg'
                })
            })

            it("should have 404 status", async function() {
                const response = await request(this.server)
                    .get(failSessionLink)
                    .set({
                        "auth-token": this.token
                    })

                expect(response.status).to.equal(404)
            })
        })

        describe("GET /expressjs/sessions/3/slots", function() {
            const getSessionSlotsLink = `/expressjs/sessions/3/slots`
            const failGetSessionSlotsLink = `/expressjs/sessions/114/slots`

            it("should be OK", async function() {
                const response = await request(this.server)
                    .get(getSessionSlotsLink)
                    .set({
                        'auth-token': this.token
                    })

                expect(response.status).to.equal(200)

                expect(response.body[0]).to.haveOwnProperty('number')
                expect(response.body[0]).to.haveOwnProperty('title')
                expect(response.body[0]).to.haveOwnProperty('seats')
            })

            it("should have status 403", async function() {
                const response = await request(this.server)
                    .get(getSessionSlotsLink)

                expect(response.status).to.equal(403)
            })

            it("should have status 404", async function() {
                const response = await request(this.server)
                    .get(failGetSessionSlotsLink)
                    .set({
                        'auth-token': this.token
                    })

                expect(response.status).to.equal(404)
            })
        })

        describe("PUT /expressjs/sessions/4", function() {
            const updateSessionLink = "/expressjs/sessions/4"
            const updatePayload: SessionBaseInterface = {
                id_play: 2,
                id_price_policy: 1,
                is_locked: false,
                timestamp: timestampFromMoment(moment()),
                max_slots: 5
            }
            const failUpdateSessionLink = "/expressjs/sessions/114"
            const failUpdatePayload = {
                is_locked: false,
                timestamp: timestampFromMoment(moment()),
                max_slots: 5
            }
            it("should be OK", async function () {
                const response = await request(this.server)
                    .put(updateSessionLink)
                    .set({
                        'auth-token': this.token
                    })
                    .send(updatePayload)

                expect(response.status).to.equal(200)
            })

            it("should have status 400", async function() {
                const response = await request(this.server)
                    .put(updateSessionLink)
                    .set({
                        'auth-token': this.token
                    })
                    .send(failUpdatePayload)

                expect(response.status).to.equal(400)
            })

            it("should have status 404", async function() {
                const response = await request(this.server)
                    .put(failUpdateSessionLink)
                    .set({
                        'auth-token': this.token
                    })
                    .send(updatePayload)

                expect(response.status).to.equal(404)
            })



        })

        describe("DELETE /expressjs/sessions/2", function() {
            const deleteSessionLink = `/expressjs/sessions/4`
            const failDeleteSessionLink = `/expressjs/sessions/114`
            it("should be OK", async function() {
                const response = await request(this.server)
                    .delete(deleteSessionLink)
                    .set({
                        "auth-token": this.token
                    })

                expect(response.status).to.equal(200)
            })

            it("should have 404 status", async function() {
                const response = await request(this.server)
                    .delete(failDeleteSessionLink)
                    .set({
                        "auth-token": this.token
                    })

                expect(response.status).to.equal(404)
            })
        })

        describe("GET /expressjs/sessions/filter/setup", function() {
            const getFilterSetupLink = `/expressjs/sessions/filter/setup`

            it("should be OK", async function () {
                const response = await request(this.server)
                    .get(getFilterSetupLink)

                expect(response.status).to.equal(200)

                expect(response.body).to.haveOwnProperty("dates")
                expect(response.body.dates[0]).to.to.haveOwnProperty("date")
                expect(response.body.dates[0]).to.to.haveOwnProperty("extended_date")

                expect(response.body).to.haveOwnProperty("auditoriums")
                expect(response.body.auditoriums[0]).to.haveOwnProperty("title")


                expect(response.body).to.haveOwnProperty("plays")
                expect(response.body.plays[0]).to.haveOwnProperty("title")

            })
        })

        describe("GET /expressjs/sessions/filter/", function() {
            const getFilteredSessionsLink = `/expressjs/sessions/filter/`
            const filterQueryPayload: SessionFilterQueryInterface = {
                date: '',
                play_title: 'Спектакль 1',
                auditorium_title: 'Главный зал'
            } 
            const failFilterQueryPayload = {
                play_title: '',
            }

            it("should be OK", async function() {
                const response = await request(this.server)
                    .get(getFilteredSessionsLink)
                    .query(filterQueryPayload)

                expect(response.status).to.equal(200)

                expect(response.body[0]).to.haveOwnProperty("id")
                expect(response.body[0]).to.haveOwnProperty("auditorium_title")
                expect(response.body[0]).to.haveOwnProperty("play_title")
                expect(response.body[0]).to.haveOwnProperty("poster_filepath")
                expect(response.body[0]).to.haveOwnProperty("timestamp")
                expect(response.body[0]).to.haveOwnProperty("is_locked").that.equals(false)
            })

            it("should have status 400", async function() {
                const response = await request(this.server)
                    .get(getFilteredSessionsLink)
                    .query(failFilterQueryPayload)

                expect(response.status).to.equal(400)
            })
        })

    })
}