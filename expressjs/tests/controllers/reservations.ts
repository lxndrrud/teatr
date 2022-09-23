import { assert, should, expect } from "chai";
import { response } from "express";
import moment from "moment";
import { agent as request } from "supertest";
import { ReservationConfirmationInterface, ReservationCreateInterface, ReservationFilterQueryInterface } from "../../interfaces/reservations";
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
                expect(response.body.length).to.equal(3)
            })

            it("should be OK for Admin", async function() {
                const response = await request(this.server)
                    .get(getReservationsLink)
                    .set({
                        "auth-token": this.adminToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body.length).to.equal(3)
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

        describe("PUT /expressjs/reservations/:idReservation/confirm", function() {
            const confirmReservationLink = `/expressjs/reservations/1/confirm`
            const failConfirmReservationLink = `/expressjs/reservations/114/confirm`
            const confirmationPayload: ReservationConfirmationInterface = {
                confirmation_code: "123456"
            }
            const failConfirmationPayload: ReservationConfirmationInterface = {
                confirmation_code: "123455"
            }

            it("should have status 403 FORBIDDEN (Without token)", async function() {
                const response = await request(this.server)
                    .put(confirmReservationLink)
                    .send(confirmationPayload)

                expect(response.status).to.equal(403)
            })

            it("should have status 404 NOT FOUND (Non existing reservation)", async function() {
                const response = await request(this.server)
                    .put(failConfirmReservationLink)
                    .set({
                        "auth-token": this.visitorToken
                    })
                    .send(confirmationPayload)

                expect(response.status).to.equal(404)
            })

            it("should have status 403 FORBIDDEN (Cashier tries to confirm)", async function() {
                const response = await request(this.server)
                    .put(confirmReservationLink)
                    .set({
                        "auth-token": this.cashierToken
                    })
                    .send(confirmationPayload)

                expect(response.status).to.equal(403)
            })

            it("should have status 409 CONFLICT (Visitors sends wrong confirmation code)", async function() {
                const response = await request(this.server)
                    .put(confirmReservationLink)
                    .set({
                        "auth-token": this.visitorToken
                    })
                    .send(failConfirmationPayload)

                expect(response.status).to.equal(409)
            })

            it("should be OK (Visitor sends correct confirmation code)", async function() {
                const response = await request(this.server)
                    .put(confirmReservationLink)
                    .set({
                        "auth-token": this.visitorToken
                    })
                    .send(confirmationPayload)

                expect(response.status).to.equal(200)
            })

        })

        describe("PUT /expressjs/reservations/:idReservation/payment", function() {
            const paymentLink = `/expressjs/reservations/1/payment`
            const failPaymentLink = `/expressjs/reservations/114/payment`

            it("should have status 403 FORBIDDEN (Without token)", async function() {
                const response = await request(this.server)
                    .put(paymentLink)
                
                expect(response.status).to.equal(403)
            })

            it("should have status 403 FORBIDDEN (Visitor tries to change payment flag)", async function() {
                const response = await request(this.server)
                    .put(paymentLink)
                    .set({
                        "auth-token": this.visitorToken
                    })

                expect(response.status).to.equal(403)
            })

            it("should have status 404 NOT FOUND (Non existing reservation)", async function() {
                const response = await request(this.server)
                    .put(failPaymentLink)
                    .set({
                        "auth-token": this.cashierToken
                    })

                expect(response.status).to.equal(404)
            })

            it("should be OK (Cashier changes Visitor`s reservation payment flag)", async function() {
                const response = await request(this.server)
                    .put(paymentLink)
                    .set({
                        "auth-token": this.cashierToken
                    })

                expect(response.status).to.equal(200)
            })
        })

        describe("DELETE /expressjs/reservations/:idReservation", function() {
            const deleteCashierReservationLink = `/expressjs/reservations/5`
            const deleteCashierReservationLink2 = `/expressjs/reservations/2`
            const deleteVisitorReservationLink = `/expressjs/reservations/3`
            const deleteVisitorReservationLink2 = `/expressjs/reservations/1`
            const deleteAdminReservationLink = `/expressjs/reservations/4`
            const failDeleteLink = `/expressjs/reservations/114`

            it("should be OK (Visitor deletes his own reservation)", async function() {
                const response = await request(this.server)
                    .delete(deleteVisitorReservationLink)
                    .set({
                        "auth-token": this.visitorToken
                    })

                expect(response.status).to.equal(200)
            })

            it("should be OK (Admin deletes another user`s reservation)", async function() {
                const response = await request(this.server)
                    .delete(deleteVisitorReservationLink2)
                    .set({
                        "auth-token": this.adminToken
                    })

                expect(response.status).to.equal(200)
            })

            it("should be OK (Cashier deletes his own reservation)", async function() {
                const response = await request(this.server)
                    .delete(deleteCashierReservationLink2)
                    .set({
                        "auth-token": this.adminToken
                    })

                expect(response.status).to.equal(200)
            })

            it("should have status 403 FORBIDDEN (Cashier deletes another user`s reservation)", async function() {
                const response = await request(this.server)
                    .delete(deleteAdminReservationLink)
                    .set({
                        "auth-token": this.cashierToken
                    })

                expect(response.status).to.equal(403)
            })

            it("should have status 403 FORBIDDEN (Without token)", async function() {
                const response = await request(this.server)
                    .delete(deleteCashierReservationLink)
                    
                expect(response.status).to.equal(403)
            })

            it("should have status 403 FORBIDDEN (Visitor deletes another user`s reservation)", async function() {
                const response = await request(this.server)
                    .delete(deleteCashierReservationLink)
                    .set({
                        "auth-token": this.visitorToken
                    })

                expect(response.status).to.equal(403)
            })

            it("should have status 404 NOT FOUND for any role (Non existing reservation)", async function() {
                const response = await request(this.server)
                    .delete(failDeleteLink)
                    .set({
                        "auth-token": this.adminToken
                    })

                expect(response.status).to.equal(404)
            })
        })

        describe("GET /expressjs/reservations/filter/setup", function() {
            const setupFilterLink = `/expressjs/reservations/filter/setup`

            it("should be OK (Visitor)", async function() {
                const response = await request(this.server)
                    .get(setupFilterLink)
                    .set({
                        "auth-token": this.visitorToken
                    })

                expect(response.status).to.equal(200)

                expect(response.body).to.haveOwnProperty("auditoriums")
                expect(response.body).to.haveOwnProperty("plays")

                expect(response.body.auditoriums).to.haveOwnProperty("length").that.equals(0)
                expect(response.body.plays).to.haveOwnProperty("length").that.equals(0)
            })

            it("should be OK (Admin)", async function() {
                const response = await request(this.server)
                    .get(setupFilterLink)
                    .set({
                        "auth-token": this.adminToken
                    })
                expect(response.status).to.equal(200)
                
                expect(response.body).to.haveOwnProperty("auditoriums")
                expect(response.body).to.haveOwnProperty("plays")

                expect(response.body.auditoriums).to.haveOwnProperty("length").that.equals(1)
                expect(typeof response.body.auditoriums[0].title).that.equals("string")

                expect(response.body.plays).to.haveOwnProperty("length").that.equals(2)
                expect(typeof response.body.plays[0].title).that.equals("string")
            })

            it("should be OK (Cashier)", async function() {
                const response = await request(this.server)
                    .get(setupFilterLink)
                    .set({
                        "auth-token": this.cashierToken
                    })
                
                expect(response.status).to.equal(200)

                expect(response.body).to.haveOwnProperty("auditoriums")
                expect(response.body).to.haveOwnProperty("plays")

                expect(response.body.auditoriums).to.haveOwnProperty("length").that.equals(1)
                expect(typeof response.body.auditoriums[0].title).that.equals("string")

                expect(response.body.plays).to.haveOwnProperty("length").that.equals(2)
                expect(typeof response.body.plays[0].title).that.equals("string")
            })
            
            it("should have status 403 FORBIDDEN (Without token)", async function() {
                const response = await request(this.server)
                    .get(setupFilterLink)

                expect(response.status).to.equal(403)
            })
        })

        describe("GET /expressjs/reservations/filter/", function() {
            const filterLink = `/expressjs/reservations/filter/`
            const dateFilterPayload: ReservationFilterQueryInterface = {
                dateFrom: '2022-10-20',
                dateTo: '2022-10-20',
                auditorium_title: "undefined",
                play_title: "undefined",
                is_locked: "false",
                id_reservation: "undefined",
            }
            const auditoriumFilterPayload: ReservationFilterQueryInterface = {
                dateFrom: "undefined",
                dateTo: "undefined",
                auditorium_title: "Главный зал",
                play_title: "undefined",
                is_locked: "false",
                id_reservation: "undefined",
            }
            const playFilterPayload: ReservationFilterQueryInterface = {
                dateFrom: "undefined",
                dateTo: "undefined",
                auditorium_title: "undefined",
                play_title: "Антракт",
                is_locked: "false",
                id_reservation: "undefined",
            }

            it("should be OK (Admin user gets reservations for play payload)", async function() {
                const link = `${filterLink}?` +  new URLSearchParams({...playFilterPayload})
                const response = await request(this.server)
                    .get(link)
                    .set({
                        "auth-token": this.adminToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body.length).to.equal(1)
                expect(response.body[0]).to.haveOwnProperty("session_timestamp")
                expect(response.body[0]).to.haveOwnProperty("auditorium_title")
                expect(response.body[0]).to.haveOwnProperty("play_title").that.equals("Антракт")
            })

            it("should be OK (Admin user gets reservations for date payload)", async function() {
                const link = `${filterLink}?` +  new URLSearchParams({...dateFilterPayload})
                const response = await request(this.server)
                    .get(link)
                    .set({
                        "auth-token": this.adminToken
                    })
                expect(response.status).to.equal(200)
                expect(response.body.length).to.equal(1)
                expect(response.body[0]).to.haveOwnProperty("session_timestamp")
                expect(response.body[0]).to.haveOwnProperty("auditorium_title")
                expect(response.body[0]).to.haveOwnProperty("play_title").that.equals("Антракт")
            })

            it("should be OK (Admin user gets reservations for auditorium payload)", async function() {
                const link = `${filterLink}?` +  new URLSearchParams({...auditoriumFilterPayload})
                const response = await request(this.server)
                    .get(link)
                    .set({
                        "auth-token": this.adminToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body.length).to.equal(3)
                expect(response.body[0]).to.haveOwnProperty("session_timestamp")
                expect(response.body[0]).to.haveOwnProperty("auditorium_title")
                expect(response.body[0]).to.haveOwnProperty("play_title").that.equals("Антракт")
            })

            it("should be OK (Cashier gets reservations for play payload)", async function() {
                const link = `${filterLink}?` +  new URLSearchParams({...playFilterPayload})
                const response = await request(this.server)
                    .get(link)
                    .set({
                        "auth-token": this.cashierToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body.length).to.equal(1)
                expect(response.body[0]).to.haveOwnProperty("session_timestamp")
                expect(response.body[0]).to.haveOwnProperty("auditorium_title")
                expect(response.body[0]).to.haveOwnProperty("play_title").that.equals("Антракт")
            })

            it("should be OK (Visitor gets empty list)", async function() {
                const link = `${filterLink}?` +  new URLSearchParams({...playFilterPayload})
                const response = await request(this.server)
                    .get(link)
                    .set({
                        "auth-token": this.visitorToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body.length).to.equal(0)
            })

            it("should have status 403 FORBIDDEN (Without token)", async function() {
                const response = await request(this.server)
                    .get(filterLink)
                    .send(playFilterPayload)

                expect(response.status).to.equal(403)
            })
        })

        
    })
}