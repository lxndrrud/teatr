import { assert, should, expect } from "chai";
import fs from 'fs'
import { agent as request, Response } from "supertest";
import { UserLoginInterface, UserRegisterInterface } from "../../interfaces/users";
import { KnexConnection } from "../../knex/connections";

export function UsersControllerTests() {
    describe("Users controller", () => {
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
                    email: 'kassir@mail.ru',
                    password: '123456'
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

        describe("POST /expressjs/users/login", function() {
            const loginLink = `/expressjs/users/login`
            const loginAdminPayload: UserLoginInterface = {
                email: "admin@admin.ru",
                password: "123456"
            }
            const loginVisitorPayload: UserLoginInterface = {
                email: "lxndrrud@yandex.ru",
                password: "123456"
            }
            const failLoginPayload: UserLoginInterface = {
                email: "admin@admin.ru",
                password: '123123123'
            }

            it("should be OK (Valid and right credentials for visitor)", async function() {
                const response = await request(this.server)
                    .post(loginLink)
                    .send(loginVisitorPayload)

                expect(response.status).to.equal(200)
                expect(response.body).to.haveOwnProperty("token")
                    .that.satisfies(() => typeof response.body.token === "string")
                expect(response.body).to.not.haveOwnProperty("isAdmin")
            })

            it("should be OK (Valid and right credentials for admin)", async function() {
                const response = await request(this.server)
                    .post(loginLink)
                    .send(loginAdminPayload)

                expect(response.status).to.equal(200)
                expect(response.body).to.haveOwnProperty("token")
                    .that.satisfies(() => typeof response.body.token === "string")
                expect(response.body).to.haveOwnProperty("isAdmin")
                    .that.satisfies(() => typeof response.body.isAdmin === 'boolean')
                    .and.equals(true)
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

        describe("GET /expressjs/users/", function() {
            const link = `/expressjs/users/`
            it("should have status 403 without token", async function() {
                const response = await request(this.server)
                    .get(link)

                expect(response.status).to.equal(403)
            })
            it("should have status 403 for visitor", async function() {
                const response = await request(this.server)
                    .get(link)
                    .set({
                        'auth-token': this.visitorToken
                    })

                expect(response.status).to.equal(403)
            })
            it("should be OK for cashier", async function() {
                const response = await request(this.server)
                    .get(link)
                    .set({
                        'auth-token': this.cashierToken
                    })
                
                expect(response.status).to.be.equal(200)
                expect(response.body).to.haveOwnProperty('length').that.is.greaterThan(0)
                expect(response.body[0]).to.haveOwnProperty("id")
                expect(response.body[0]).to.haveOwnProperty("id_role")
                expect(response.body[0]).to.haveOwnProperty("role_title")
                expect(response.body[0]).to.haveOwnProperty("email").that.contains("***")
                expect(response.body[0]).to.haveOwnProperty("firstname")
                expect(response.body[0]).to.haveOwnProperty("middlename")
                expect(response.body[0]).to.haveOwnProperty("lastname")
                expect(response.body[0]).to.not.haveOwnProperty("token")
                expect(response.body[0]).to.not.haveOwnProperty("password")
            })
            it("should be OK for admin", async function() {
                const response = await request(this.server)
                    .get(link)
                    .set({
                        'auth-token': this.adminToken
                    })
                
                expect(response.status).to.be.equal(200)
                expect(response.body).to.haveOwnProperty('length').that.is.greaterThan(0)
                expect(response.body[0]).to.haveOwnProperty("id")
                expect(response.body[0]).to.haveOwnProperty("id_role")
                expect(response.body[0]).to.haveOwnProperty("role_title")
                expect(response.body[0]).to.haveOwnProperty("email").that.contains("***")
                expect(response.body[0]).to.haveOwnProperty("firstname")
                expect(response.body[0]).to.haveOwnProperty("middlename")
                expect(response.body[0]).to.haveOwnProperty("lastname")
                expect(response.body[0]).to.not.haveOwnProperty("token")
                expect(response.body[0]).to.not.haveOwnProperty("password")
            })

        })

        describe("GET /expressjs/users/:idUser", function() {
            const link = '/expressjs/users/1'
            const failLink = '/expressjs/users/kek'
            const failLinkNotFound = '/expressjs/users/11100'
            it("should have status 403 without token", async function() {
                const response = await request(this.server)
                    .get(link)

                expect(response.status).to.equal(403)
            })
            it("should have status 403 because visitor token", async function() {
                const response = await request(this.server)
                    .get(link)
                    .set({
                        'auth-token': this.visitorToken
                    })
                
                expect(response.status).to.equal(403)
            })
            it("should have status 400 because with wrong user id", async function() {
                const response = await request(this.server)
                    .get(failLink)
                    .set({
                        'auth-token': this.adminToken
                    })

                expect(response.status).to.equal(400)
            })
            it("should have status 404 because of non-existing id record", async function() {
                const response = await request(this.server)
                    .get(failLinkNotFound)
                    .set({
                        'auth-token': this.adminToken
                    })

                expect(response.status).to.equal(404)
            })
            it("should be OK", async function() {
                const response = await request(this.server)
                    .get(link)
                    .set({
                        'auth-token': this.adminToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body.user).to.haveOwnProperty('email').that.contains("***")
                expect(response.body.user).to.haveOwnProperty('firstname')
                expect(response.body.user).to.haveOwnProperty('middlename')
                expect(response.body.user).to.haveOwnProperty('lastname')
                expect(response.body.user).to.haveOwnProperty("id").that.equals(1)
                expect(response.body.user).to.haveOwnProperty('id_role')
                expect(response.body.user).to.haveOwnProperty("role_title")
                expect(response.body.user).not.to.haveOwnProperty('password')
                expect(response.body.user).not.to.haveOwnProperty('token')
            })
        })

        describe("GET /expressjs/users/personalArea", function() {
            const link = '/expressjs/users/personalArea'
            it("should have status 403", async function() {
                const response = await request(this.server)
                    .get(link)

                expect(response.status).to.equal(403)
            })

            it("should be OK for visitor", async function() {
                const response = await request(this.server)
                    .get(link)
                    .set({
                        'auth-token': this.visitorToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body).to.haveOwnProperty("user")
                expect(response.body.user).to.haveOwnProperty("email").that.contains("***")
                expect(response.body.user).to.haveOwnProperty("firstname")
                expect(response.body.user).to.haveOwnProperty("middlename")
                expect(response.body.user).to.haveOwnProperty("lastname")
                expect(response.body.user).to.not.haveOwnProperty("password")
                expect(response.body.user).to.not.haveOwnProperty("token")
            })

            it("should be OK for admin", async function() {
                const response = await request(this.server)
                    .get(link)
                    .set({
                        'auth-token': this.adminToken
                    })

                expect(response.status).to.equal(200)
                expect(response.body).to.haveOwnProperty("user")
                expect(response.body.user).to.haveOwnProperty("email").that.contains("***")
                expect(response.body.user).to.haveOwnProperty("firstname")
                expect(response.body.user).to.haveOwnProperty("middlename")
                expect(response.body.user).to.haveOwnProperty("lastname")
                expect(response.body.user).to.not.haveOwnProperty("password")
                expect(response.body.user).to.not.haveOwnProperty("token")
            })
        })

        describe("POST /expressjs/users/restore/password", function() {
            const link = '/expressjs/users/restore/password'
            const okEmail = 'lxndrrud@yandex.ru'

            it("should be OK ", function() {
                request(this.server)
                .post(link)
                .send({
                    email: okEmail
                })
                .then(response => {
                    setTimeout(() => {
                        expect(response.status).to.equal(200)
                    }, 2000)
                })

            })
        })

        describe("POST /expressjs/users/csv/create", function() {
            const link = '/expressjs/users/csv/create'

            it('should be OK', async function() {
                const response = await request(this.server)
                    .post(link)
                    .set({
                        'auth-token': this.adminToken,
                        'content-type': 'multipart/form-data'
                    })
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/users/test_users_create_OK.csv"), 
                        "test_users.csv")
                expect(response.body).to.haveOwnProperty('errors').that.haveOwnProperty('length')
                    .that.equals(0)
            })
        }) 
        
    })
}