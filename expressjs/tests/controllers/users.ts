import { assert, should, expect } from "chai";
import fs from 'fs'
import { agent as request, Response } from "supertest";
import { IUserChangePassword, IUserPersonalInfo, UserLoginInterface, UserRegisterInterface } from "../../interfaces/users";
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
                    .that.satisfies(() => typeof response.body.password === "string").that.equals('')
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
                        .that.satisfies(() => typeof response.body.password === "string").that.equals('')
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

        describe.skip("POST /expressjs/users/adminLogin", function() {
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
            it("should have status 403 for cashier because has`nt got access", async function() {
                const response = await request(this.server)
                    .get(link)
                    .set({
                        'auth-token': this.cashierToken
                    })
                
                expect(response.status).to.be.equal(403)
                /*expect(response.body).to.haveOwnProperty('length').that.is.greaterThan(0)
                expect(response.body[0]).to.haveOwnProperty("id")
                expect(response.body[0]).to.haveOwnProperty("id_role")
                expect(response.body[0]).to.haveOwnProperty("role_title")
                expect(response.body[0]).to.haveOwnProperty("email").that.contains("***")
                expect(response.body[0]).to.haveOwnProperty("firstname")
                expect(response.body[0]).to.haveOwnProperty("middlename")
                expect(response.body[0]).to.haveOwnProperty("lastname")
                expect(response.body[0]).to.not.haveOwnProperty("token")
                expect(response.body[0]).to.not.haveOwnProperty("password")*/
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
                expect(response.body.user).to.haveOwnProperty('email').that.contains("***").and
                    .satisfies(() => typeof response.body.user.email === 'string')
                expect(response.body.user).to.haveOwnProperty('firstname')
                    .that.satisfies(() => typeof response.body.user.firstname === 'string')
                expect(response.body.user).to.haveOwnProperty('middlename')
                    .that.satisfies(() => typeof response.body.user.middlename === 'string')
                expect(response.body.user).to.haveOwnProperty('lastname')
                    .that.satisfies(() => typeof response.body.user.lastname === 'string')
                expect(response.body.user).to.haveOwnProperty("id").that.equals(1)
                    .that.satisfies(() => typeof response.body.user.id === 'number')
                expect(response.body.user).to.haveOwnProperty('id_role')
                    .that.satisfies(() => typeof response.body.user.id_role === 'number')
                expect(response.body.user).to.haveOwnProperty("role_title")
                    .that.satisfies(() => typeof response.body.user.role_title === 'string')
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

        describe("PUT /expressjs/users/edit/password", function() {
            const link = '/expressjs/users/edit/password'
            const failPayload = {
                new: 'new',
                old: '123456'
            }
            const okPayload = <IUserChangePassword> {
                newPassword: 'kek',
                oldPassword: '123456',
                confirmPassword: "kek"
            }
            const failPayload_WrongOldPassword = <IUserChangePassword> {
                newPassword: 'kek',
                oldPassword: 'wrong!',
                confirmPassword: "kek"
            }
            const failPayload_WrongConfirmation = <IUserChangePassword> {
                newPassword: 'kek',
                oldPassword: '123456',
                confirmPassword: "wrong!"
            }
            const failPayload_SameNewPassword = <IUserChangePassword> {
                newPassword: 'kek',
                oldPassword: '123456',
                confirmPassword: "wrong!"
            }

            it("should fail because without token", async function () {
                const response = await request(this.server)
                    .put(link)
                    .send(okPayload)
                expect(response.statusCode).to.equal(403)
            })

            it("should fail because of wrong payload", async function () {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.adminToken
                    })
                    .send(failPayload)
                expect(response.statusCode).to.equal(400)
            })

            it('should fail because of wrong old password', async function() {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.adminToken
                    })
                    .send(failPayload_WrongOldPassword)
                expect(response.statusCode).to.equal(400)
            })

            it('should fail because confirmation and new password are not equal', async function() {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.adminToken
                    })
                    .send(failPayload_WrongConfirmation)
                expect(response.statusCode).to.equal(400)
            })

            it('should fail because old password and new password are equal', async function() {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.adminToken
                    })
                    .send(failPayload_SameNewPassword)
                expect(response.statusCode).to.equal(400)
            })

            it('should be OK for Admin', async function() {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.adminToken
                    })
                    .send(okPayload)
                expect(response.statusCode).to.equal(200)
            })

            it('should be OK for Cashier', async function() {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.cashierToken
                    })
                    .send(okPayload)
                expect(response.statusCode).to.equal(200)
            })

            it('should be OK for Visitor', async function() {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.visitorToken
                    })
                    .send(okPayload)
                expect(response.statusCode).to.equal(200)
            })
        })

        describe("PUT /expressjs/users/edit/personal", function() {
            const link = '/expressjs/users/edit/personal'
            const failPayload = {
                first: 'kek',
                middle: 'kek',
                last: 'kek'
            }
            const okPayload = <IUserPersonalInfo> {
                firstname: 'kek',
                middlename: 'kek',
                lastname: 'kek'
            }

            it("should fail because without token", async function() {
                const response = await request(this.server)
                    .put(link)
                    .send(okPayload)
                expect(response.statusCode).to.equal(403)
            })

            it("should fail because of wrong payload", async function() {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.adminToken
                    })
                    .send(failPayload)
                expect(response.statusCode).to.equal(400)
            })

            it('should be OK for Admin', async function () {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.adminToken
                    })
                    .send(okPayload)
                expect(response.statusCode).to.equal(200)
            })

            it('should be OK for Cashier', async function () {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.cashierToken
                    })
                    .send(okPayload)
                expect(response.statusCode).to.equal(200)
            })

            it('should be OK for Visitor', async function () {
                const response = await request(this.server)
                    .put(link)
                    .set({
                        'auth-token': this.visitorToken
                    })
                    .send(okPayload)
                expect(response.statusCode).to.equal(200)
            })

        })

        describe('Восстановление пароля по почте', function() {
            describe("POST /expressjs/users/restore/password", function() {
                const link = '/expressjs/users/restore/password'
                const okEmail = 'lxndrrud@yandex.ru'
                const failAdminEmail = `admin@admin.ru`
                const failCashierEmail = `kassir@mail.ru`
                const failNonExistEmail = 'non-exist@mail.ru'
    
                it('should FAIL because of non-existing user email', async function() {
                    const response = await request(this.server)
                        .post(link)
                        .send({
                            email: failNonExistEmail
                        })
                    
                    expect(response.statusCode).to.equal(404)
                })
    
                it('should FAIL because password restoration is not allowed for Cashier Role', function() {
                    request(this.server)
                    .post(link)
                    .send({
                        email: failCashierEmail
                    })
                    .then(response => {
                        expect(response.status).to.equal(403)
                    })
                })
    
                it('should FAIL because password restoration is not allowed for Admin Role', function() {
                    request(this.server)
                    .post(link)
                    .send({
                        email: failAdminEmail
                    })
                    .then(response => {
                        expect(response.status).to.equal(403)
                    })
                })
    
                it("should be OK ", function() {
                    request(this.server)
                    .post(link)
                    .send({
                        email: okEmail
                    })
                    .then(response => {
                        expect(response.status).to.equal(200)
                    })
    
                })
    
                it("should FAIL because of restoration repeat timeout", function() {
                    request(this.server)
                    .post(link)
                    .send({
                        email: okEmail
                    })
                    .then(response => {
                        expect(response.status).to.equal(403)
                    })
                })            
            })
    
            describe("POST /expressjs/users/restore/password/resendEmail", function() {
                const link = '/expressjs/users/restore/password/resendEmail'
                const failResendTimeoutEmail = 'lxndrrud@yandex.ru'
                const failAdminEmail = `admin@admin.ru`
                const failCashierEmail = `kassir@mail.ru`
                const failNonExistEmail = 'non-exist@mail.ru'

                it('should FAIL because Admin is not allowed to restore password', async function() {
                    const response = await request(this.server)
                        .post(link)
                        .send({
                            email: failAdminEmail
                        })
    
                    expect(response.status).to.equal(403)
                })

                it('should FAIL because Cashier is not allowed to restore password', async function() {
                    const response = await request(this.server)
                        .post(link)
                        .send({
                            email: failCashierEmail
                        })
    
                    expect(response.status).to.equal(403)
                })

                it('should FAIL because of non-existing user', async function() {
                    const response = await request(this.server)
                        .post(link)
                        .send({
                            email: failNonExistEmail
                        })
    
                    expect(response.status).to.equal(404)
                })
    
                it('should FAIL because of resend timeout', async function() {
                    const response = await request(this.server)
                        .post(link)
                        .send({
                            email: failResendTimeoutEmail
                        })
    
                    expect(response.status).to.equal(403)
                }).retries(3)
            })
        })

        describe("POST /expressjs/users/csv/create", function() {
            const link = '/expressjs/users/csv/create'

            it("should fail in every row (3 errors in CSV-file)", async function() {
                const response = await request(this.server)
                    .post(link)
                    .set({
                        'auth-token': this.adminToken,
                        'content-type': 'multipart/form-data'
                    })
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/users/test_users_create_FAIL.csv"), 
                        "test_users.csv")

                expect(response.body).to.haveOwnProperty('errors').that.haveOwnProperty('length')
                    .that.equals(3)
            })

            it("should return 403 status code for visitor", async function() {
                const response = await request(this.server)
                    .post(link)
                    .set({
                        'auth-token': this.visitorToken,
                        'content-type': 'multipart/form-data'
                    })
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/users/test_users_create_OK.csv"), 
                        "test_users.csv")
                
                expect(response.statusCode).to.equal(403)
            })

            it("should return 403 status code for cashier", async function() {
                const response = await request(this.server)
                    .post(link)
                    .set({
                        'auth-token': this.cashierToken,
                        'content-type': 'multipart/form-data'
                    })
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/users/test_users_create_OK.csv"), 
                        "test_users.csv")
                
                expect(response.statusCode).to.equal(403)
            })

            it("should fail because it`s sent without file", async function() {
                const response = await request(this.server)
                    .post(link)
                    .set({
                        'auth-token': this.adminToken,
                        'content-type': 'multipart/form-data'
                    })

                expect(response.statusCode).to.equal(400)
            })

            it('should fail (403 status code) because it`s sent without token', async function() {
                const response = await request(this.server)
                    .post(link)
                    .set({
                        'content-type': 'multipart/form-data'
                    })
                    .attach("csv", 
                    fs.readFileSync("/usr/src/app/tests/test_files/csv/users/test_users_create_OK.csv"), 
                        "test_users.csv")

                expect(response.statusCode).to.equal(403)
            })

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