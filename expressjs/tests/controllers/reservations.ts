import { assert, should, expect } from "chai";
import { response } from "express";
import moment from "moment";
import { agent as request } from "supertest";
import { ReservationCreateInterface } from "../../interfaces/reservations";
import { KnexConnection } from "../../knex/connections";

export function ReservationsControllerTest() {
    describe("Reservations Controller", function() {
        before(async function() {
            await KnexConnection.migrate.rollback()
            await KnexConnection.migrate.latest()
            await KnexConnection.seed.run()

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

            const adminTokenResponse = await request(this.server)
                .post(this.authLink)
                .send({
                    email: "admin@admin.ru",
                    password: "123456"
                })
            this.adminToken = adminTokenResponse.body.token
        })

        describe("GET /expressjs/reservations", function() {
            const getReservationsLink = `/expressjs/reservations`

            it("should be OK for Visitor", async function() {
                const response = await request(this.server)
                    .get(getReservationsLink)
                    .set({
                        "auth-token": this.visitorToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body.length).to.equal(1)
            })

            it("should be OK for Cashier", async function() {
                const response = await request(this.server)
                    .get(getReservationsLink)
                    .set({
                        "auth-token": this.cashierToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body.length).to.equal(2)
            })

            it("should be OK for Admin", async function() {
                const response = await request(this.server)
                    .get(getReservationsLink)
                    .set({
                        "auth-token": this.adminToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body.length).to.equal(2)
            })

            it("should have status FORBIDDEN 403", async function() {
                const response = await request(this.server)
                    .get(getReservationsLink)

                expect(response.status).to.equal(403)
            })
        })

        describe("POST /expressjs/reservations", function() {
            const postReservationsLink = `/expressjs/reservations`
            const postReservationPayload: ReservationCreateInterface = {
                id_session: 4,
                slots: [
                    {
                        id: 15,
                    }, 
                    {
                        id: 16
                    }
                ]
            }
            const post6SlotsReservationPayload1: ReservationCreateInterface = {
                id_session: 4,
                slots: [
                    {
                        id: 5,
                    }, 
                    {
                        id: 6
                    },
                    {
                        id: 7,
                    }, 
                    {
                        id: 8
                    },
                    {
                        id: 9,
                    }, 
                    {
                        id: 10
                    }
                ]
            }
            const post6SlotsReservationPayload2: ReservationCreateInterface = {
                id_session: 4,
                slots: [
                    {
                        id: 11,
                    }, 
                    {
                        id: 12,
                    },
                    {
                        id: 13,
                    }, 
                    {
                        id: 14,
                    },
                    {
                        id: 17,
                    }, 
                    {
                        id: 18,
                    }
                ]
            }
            const postSlotsCollissionPayload: ReservationCreateInterface = {
                id_session: 4,
                slots: [
                    {
                        id: 15,
                    }, 
                    {
                        id: 30,
                    }
                ]
            }

            it("should be OK for Visitor", async function() { 
                const response = await request(this.server)
                    .post(postReservationsLink)
                    .set({
                        "auth-token": this.visitorToken
                    })
                    .send(postReservationPayload)

                expect(response.status).to.equal(201)
                expect(response.body).to.haveOwnProperty("id_session").that.equals(4)
                expect(response.body).to.haveOwnProperty("need_confirmation").that.equals(true)
            })

            it("should be OK for Admin (slots quantity is more than max slots)", async function() { 
                const response = await request(this.server)
                    .post(postReservationsLink)
                    .set({
                        "auth-token": this.adminToken
                    })
                    .send(post6SlotsReservationPayload1)

                expect(response.status).to.equal(201)
                expect(response.body).to.haveOwnProperty("id_session").that.equals(4)
                expect(response.body).to.haveOwnProperty("need_confirmation").that.equals(false)
            })

            it("should be OK for Cashier (slots quantity is more than max slots)", async function() { 
                const response = await request(this.server)
                    .post(postReservationsLink)
                    .set({
                        "auth-token": this.cashierToken
                    })
                    .send(post6SlotsReservationPayload2)

                expect(response.status).to.equal(201)

                expect(response.body).to.haveOwnProperty("id_session").that.equals(4)
                expect(response.body).to.haveOwnProperty("need_confirmation").that.equals(false)
            })

            it("should have status FORBIDDEN 403 (without auth token)", async function() {
                const response = await request(this.server)
                    .post(postReservationsLink)
                    .send(postReservationPayload)

                expect(response.status).to.equal(403)
            })

            it("should have status CONFLICT 409 (slots collission)", async function() {
                const response = await request(this.server)
                    .post(postReservationsLink)
                    .set({
                        "auth-token": this.cashierToken
                    })
                    .send(postSlotsCollissionPayload)

                expect(response.status).to.equal(409)
            })

            it("should have status FORBIDDEN 403 (visitor more than one reservation on session))", async function() {
                const response = await request(this.server)
                    .post(postReservationsLink)
                    .set({
                        "auth-token": this.visitorToken
                    })
                    .send(postSlotsCollissionPayload)

                expect(response.status).to.equal(403)
            })

            it("should have status 403 FORBIDDEN (slots quantity is more than max slots)", async function() {
                const response = await request(this.server)
                    .post(postReservationsLink)
                    .set({
                        "auth-token": this.visitorToken
                    })
                    .send(post6SlotsReservationPayload1)

                expect(response.status).to.equal(403)
            })
        })

        describe("GET /expressjs/reservations/:idReservation", function() {
            const getReservationLink = `/expressjs/reservations/4`
            const fail404GetReservationLink = `/expressjs/reservations/114`
            const failFake403GetReservationLink = `/expressjs/reservations/4`

            it("should be OK (Cashier)", async function() {
                const response = await request(this.server)
                    .get(getReservationLink)
                    .set({
                        "auth-token": this.cashierToken
                    })

                expect(response.status).to.equal(200)

                expect(response.body).to.haveOwnProperty("id").that.equals(4)
                expect(response.body).to.haveOwnProperty("play_title")
                expect(response.body).to.haveOwnProperty("auditorium_title")
                expect(response.body).to.haveOwnProperty("id_user")
                expect(response.body).to.haveOwnProperty("id_session")
                expect(response.body).to.haveOwnProperty("session_timestamp")
                expect(response.body).to.haveOwnProperty("is_paid")
                expect(response.body).to.haveOwnProperty("is_confirmed")
                expect(response.body).to.haveOwnProperty("confirmation_code").that.equals("")
                expect(response.body).to.haveOwnProperty("session_is_locked")
            })

            it("should be OK (Admin)", async function() {
                const response = await request(this.server)
                    .get(getReservationLink)
                    .set({
                        "auth-token": this.adminToken
                    })

                expect(response.status).to.equal(200)

                expect(response.body).to.haveOwnProperty("id").that.equals(4)
                expect(response.body).to.haveOwnProperty("play_title")
                expect(response.body).to.haveOwnProperty("auditorium_title")
                expect(response.body).to.haveOwnProperty("id_user")
                expect(response.body).to.haveOwnProperty("id_session")
                expect(response.body).to.haveOwnProperty("session_timestamp")
                expect(response.body).to.haveOwnProperty("is_paid")
                expect(response.body).to.haveOwnProperty("is_confirmed")
                expect(response.body).to.haveOwnProperty("confirmation_code").that.equals("")
                expect(response.body).to.haveOwnProperty("session_is_locked")
            })

            it("should have status FORBIDDEN 404 (Visitor will have got 404 instead of 403)", async function() {
                const response = await request(this.server)
                    .get(failFake403GetReservationLink)
                    .set({
                        "auth-token": this.visitorToken
                    })

                expect(response.status).to.equal(404)
            })

            it("should have status NotFound 404 (Admin)", async function() {
                const response = await request(this.server)
                    .get(fail404GetReservationLink)
                    .set({
                        "auth-token": this.adminToken
                    })

                expect(response.status).to.equal(404)
            })
        })
    })
}