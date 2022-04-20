import { doesNotMatch } from "assert";
import { assert, should, expect } from "chai";
import { agent as request } from "supertest";

export function PlaysControllerTests () {
    describe("Plays contoller", () => {
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
    })

}

