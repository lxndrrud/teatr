import { assert, should, expect } from "chai";
import { agent as request } from "supertest";
import { UserLoginInterface, UserRegisterInterface } from "../../interfaces/users";
import { KnexConnection } from "../../knex/connections";

export function UsersControllerTests() {
    describe("Users controller", () => {
        before(async function() {
            await KnexConnection.migrate.rollback()
            await KnexConnection.migrate.latest()
            await KnexConnection.seed.run()
        })

        describe("POST /expressjs/users/login", function() {
            const loginLink = `/expressjs/users/login`
            const loginPayload: UserLoginInterface = {
                email: "admin@admin.ru",
                password: "123456"
            }
            const failLoginPayload: UserLoginInterface = {
                email: "admin@admin.ru",
                password: '123123123'
            }

            it("should be OK (Valid and right credentials)", async function() {
                const response = await request(this.server)
                    .post(loginLink)
                    .send(loginPayload)

                expect(response.status).to.equal(200)
                expect(response.body).to.haveOwnProperty("token").that.satisfies(() => typeof response.body.token === "string")
            })

            it("should have status 401 WRONG CREDENTIALS", async function() {
                const response = await request(this.server)
                    .post(loginLink)
                    .send(failLoginPayload)

                expect(response.status).to.equal(401)
            })

            it("should have status 400 BAD REQUEST (Wrong payload)", async function() {
                const response = await request(this.server)
                    .post(loginLink)

                expect(response.status).to.equal(400)
            })
        })

        describe("POST /expressjs/users/", function() {
            const registerLink = `/expressjs/users/`
            const registerPayload: UserRegisterInterface = {
                email: "test@test.ru",
                password: "test",
            }
            const fullRegisterPayload: UserRegisterInterface = {
                email: "test123@test.ru",
                password: "test",
                firstname: "Тест",
                middlename: "Тестович",
                lastname: "Тестов"
            }
            const failRegisterPayload = {
                password: "wrong-test"
            }
            const existingUserPayload: UserRegisterInterface = {
                email: "admin@admin.ru",
                password: "123455"
            }

            it("should be OK (Partial payload)", async function() {
                const response = await request(this.server)
                    .post(registerLink)
                    .send(registerPayload)

                expect(response.status).to.equal(201)
                expect(response.body).to.haveOwnProperty("token")
                    .that.satisfies(() => typeof response.body.token === "string")
                expect(response.body).to.haveOwnProperty("id")
                    .that.satisfies(() => typeof response.body.id === "number")
                expect(response.body).to.haveOwnProperty("id_role")
                    .that.satisfies(() => typeof response.body.id_role === "number")
                expect(response.body).to.haveOwnProperty("firstname")
                    .that.satisfies(() => typeof response.body.firstname === "string")
                expect(response.body).to.haveOwnProperty("middlename")
                    .that.satisfies(() => typeof response.body.middlename === "string")
                expect(response.body).to.haveOwnProperty("lastname")
                    .that.satisfies(() => typeof response.body.lastname === "string")
                expect(response.body).to.haveOwnProperty("email")
                    .that.satisfies(() => typeof response.body.email === "string")
                expect(response.body).to.haveOwnProperty("password")
                    .that.satisfies(() => typeof response.body.password === "string")
            })

            it("should be OK (Full payload)", async function() {
                const response = await request(this.server)
                    .post(registerLink)
                    .send(fullRegisterPayload)

                    expect(response.status).to.equal(201)
                    expect(response.body).to.haveOwnProperty("token")
                        .that.satisfies(() => typeof response.body.token === "string")
                    expect(response.body).to.haveOwnProperty("id")
                        .that.satisfies(() => typeof response.body.id === "number")
                    expect(response.body).to.haveOwnProperty("id_role")
                        .that.satisfies(() => typeof response.body.id_role === "number")
                    expect(response.body).to.haveOwnProperty("firstname")
                        .that.satisfies(() => typeof response.body.firstname === "string")
                    expect(response.body).to.haveOwnProperty("middlename")
                        .that.satisfies(() => typeof response.body.middlename === "string")
                    expect(response.body).to.haveOwnProperty("lastname")
                        .that.satisfies(() => typeof response.body.lastname === "string")
                    expect(response.body).to.haveOwnProperty("email")
                        .that.satisfies(() => typeof response.body.email === "string")
                    expect(response.body).to.haveOwnProperty("password")
                        .that.satisfies(() => typeof response.body.password === "string")
            })

            it("should have status 400 BAD REQUEST (Wrong payload)", async function() {
                const response = await request(this.server)
                    .post(registerLink)
                    .send(failRegisterPayload)

                expect(response.status).to.equal(400)
            })

            it("should have status 409 CONFLICT (Existing user with the same email)", async function() {
                const response = await request(this.server)
                    .post(registerLink)
                    .send(existingUserPayload)

                expect(response.status).to.equal(409)
            })
        })

        describe("POST /expressjs/users/adminLogin", function() {
            const adminLoginLink = `/expressjs/users/adminLogin`
            const loginPayload: UserLoginInterface = {
                email: "admin@admin.ru",
                password: "123456"
            }
            const failLoginPayloadWrong: UserLoginInterface = {
                email: "admin@admin.ru",
                password: '123123123'
            }
            const failLoginPayloadForbidden: UserLoginInterface = {
                email: "lxndrrud@yandex.ru",
                password: "123456"
            }
            it("should fail (403 Forbidden for non-admin users)", async function() {
                const response = await request(this.server)
                    .post(adminLoginLink)
                    .send(failLoginPayloadForbidden)
                
                expect(response.statusCode).to.equal(403)
            })
            it("should fail (401 wrong credentials are sent)", async function() {
                const response = await request(this.server)
                    .post(adminLoginLink)
                    .send(failLoginPayloadWrong)
            
                expect(response.statusCode).to.equal(401)
            })
            it("should be OK (200 OK with token )", async function() {
                const response = await request(this.server)
                    .post(adminLoginLink)
                    .send(loginPayload)

                expect(response.statusCode).to.equal(200)
                expect(response.body).to.haveOwnProperty("token")
            })
        })
    })
}