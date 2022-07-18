import { expect } from "chai"
import { RoleFetchingModel } from "../../services/roles"
import { UserFetchingModel } from "../../services/users"
import { RoleDatabaseInterface } from "../../interfaces/roles"
import { UserBaseInterface, UserLoginInterface } from "../../interfaces/users"
import { KnexConnection } from "../../knex/connections"
import { RoleMockModel } from "../mockModels/roles"
import { UserMockModel } from "../mockModels/users"


export function UserServiceTests() {
    describe("User Service", () => {
        const userMockModel = new UserMockModel()
        const roleFetchingInstance = new RoleFetchingModel(new RoleMockModel())
        const userService = new UserFetchingModel(
            userMockModel, 
            roleFetchingInstance)

        describe("Create User", function() {
            const userPayload = userMockModel.userPayload

            it("should fail and have inner error code 409 (existing user)", async function() {
                const failPayload: UserBaseInterface = {
                    email: userMockModel.usersList[0].email,
                    password: userMockModel.usersList[0].password,
                    id_role: 3
                }
                const response = await userService.createUser(failPayload)

                expect(response).to.haveOwnProperty("code").that.equals(409)
            })
            it("should fail and inner error code 500 (database error)", async function() {
                const failPayload: UserBaseInterface = {
                    email: "test@test.test",
                    password: "123456",
                    firstname: "fail",
                    id_role: 3
                }

                const response = await userService.createUser(failPayload)

                expect(response).to.haveOwnProperty("code").that.equals(500)
            })
            it("should be OK (create and return user)", async function() {
                const lengthBefore = userMockModel.usersList.length

                const response = await userService.createUser(userPayload)

                expect(userMockModel.usersList.length).to.equal(lengthBefore + 1)
                expect(response).to.haveOwnProperty("id").that.equals(3)
                expect(response).to.haveOwnProperty("id_role").that.equals(userPayload.id_role)
                expect(response).to.haveOwnProperty("firstname").that.equals(userPayload.firstname)
                expect(response).to.haveOwnProperty("middlename").that.equals(userPayload.middlename)
                expect(response).to.haveOwnProperty("lastname").that.equals(userPayload.lastname)
                expect(response).to.haveOwnProperty("email").that.equals(userPayload.email)
                expect(response).to.haveOwnProperty("password")
            }) 
        })

        describe("Login user", function() {
            it("should fail and return inner error code 500 (database error while searching for user)", async function() {
                const failPayload: UserLoginInterface = {
                    email: "fail",
                    password: "123456"
                }

                const response = await userService.loginUser(failPayload)

                expect(response).to.haveOwnProperty("code").that.equal(500)
            })

            it("should fail and return inner error code 401 (non existing user)", async function() {
                const failNonExistingUserPayload = <UserLoginInterface>{
                    email: "non-existing@user.kek",
                    password: "12312312313"
                }

                const response = await userService.loginUser(failNonExistingUserPayload)

                expect(response).to.haveOwnProperty("code").that.equals(401)
                expect(response).to.haveOwnProperty("message")
            })

            it("should fail and return inner error code 401 (wrong credentials)", async function() {
                const failWrongCredentialsUserPayload = <UserLoginInterface>{
                    email:  userMockModel.usersList[0].email,
                    password: "wrong credentials"
                }

                const response = await userService.loginUser(failWrongCredentialsUserPayload)

                expect(response).to.haveOwnProperty("code").that.equals(401)
                expect(response).to.haveOwnProperty("message")
            })

            it("should fail and return inner error code 500 (database error while generating token)", async function() {
                const failTokenErrorPayload = <UserLoginInterface>{
                    email: "fail token",
                    password: "123456"
                }

                const response = await userService.loginUser(failTokenErrorPayload)

                expect(response).to.haveOwnProperty("code").that.equals(500)
                expect(response).to.haveOwnProperty("message")
            })

            it("should be OK (successful login)", async function() {
                const userPayload = <UserLoginInterface>{ 
                    email: userMockModel.usersList[0].email,
                    password: "123456"
                }

                const response = await userService.loginUser(userPayload)

                expect(typeof response).to.equal("string")
            })
        })

        describe("Create User Action", function() {
            const visitor = <RoleDatabaseInterface> {
                id: 3,
                title: 'Посетитель',
                can_have_more_than_one_reservation_on_session: false,
                can_see_all_reservations: false,
                can_access_private: false,
                can_make_reservation_without_confirmation: false,
                can_avoid_max_slots_property: false,
            }
            const admin = <RoleDatabaseInterface> {
                id: 10034,
                title: 'Администратор',
                can_have_more_than_one_reservation_on_session: true,
                can_see_all_reservations: true,
                can_access_private: true,
                can_make_reservation_without_confirmation: true,
                can_avoid_max_slots_property: true,
            }
            const cashier = <RoleDatabaseInterface> {
                id: 9342,
                title: 'Кассир',
                can_have_more_than_one_reservation_on_session: true,
                can_see_all_reservations: true,
                can_access_private: false,
                can_make_reservation_without_confirmation: true,
                can_avoid_max_slots_property: true,
            }
            const user = userMockModel.usersList[0]

            it("should fail and return inner error code 403 (forbidden action for user role)", async function() {
                const trx = await KnexConnection.transaction()
                const response = await userService.createAction(trx, user.id, visitor, "test description")
                await trx.rollback()

                expect(response).to.haveOwnProperty("code").that.equals(403)
                expect(response).to.haveOwnProperty("message")
            })

            it("should fail and return inner error code 500 (database error while inserting action)", async function() {
                const trx = await KnexConnection.transaction()
                const response = await userService.createAction(trx, user.id, cashier, "fail")
                await trx.rollback()

                expect(response).to.haveOwnProperty("code").that.equals(500)
                expect(response).to.haveOwnProperty("message")
            })

            it("should be OK (successful action creation)", async function() {
                const lengthBefore = userMockModel.userActionsList.length

                const trx = await KnexConnection.transaction()
                const response = await userService.createAction(trx, user.id, admin, 
                    "test successful action creation")
                await trx.rollback()

                expect(response).to.equal(undefined)
                expect(userMockModel.userActionsList.length).to.equal(lengthBefore + 1)
            })
        })
    })
}