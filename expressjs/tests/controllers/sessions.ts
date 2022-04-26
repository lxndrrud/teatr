import { assert, should, expect } from "chai";
import { agent as request } from "supertest";


export function SessionsControllerTest() {
    describe("Sessions Controller", () => {
        before(async function() {
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
    })
}