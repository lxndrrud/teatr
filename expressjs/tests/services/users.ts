import { expect } from "chai"
import { RoleFetchingModel } from "../../fetchingModels/roles"
import { UserFetchingModel } from "../../fetchingModels/users"
import { UserBaseInterface, UserLoginInterface } from "../../interfaces/users"
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
                expect(response).to.haveOwnProperty("id").that.equals(2)
                expect(response).to.haveOwnProperty("id_role").that.equals(userPayload.id_role)
                expect(response).to.haveOwnProperty("firstname").that.equals(userPayload.firstname)
                expect(response).to.haveOwnProperty("middlename").that.equals(userPayload.middlename)
                expect(response).to.haveOwnProperty("lastname").that.equals(userPayload.lastname)
                expect(response).to.haveOwnProperty("email").that.equals(userPayload.email)
                expect(response).to.haveOwnProperty("password")
            }) 
        })

        describe("Login user", async function() {
            const userPayload = <UserLoginInterface>{ 
                email: userMockModel.usersList[0].email,
                password: userMockModel.usersList[0].password
            }

            it("should fail and return inner error code 500 (database error while searching for user", async function() {
                const failPayload: UserLoginInterface = {
                    email: "fail",
                    password: "123456"
                }

                const response = await userService.loginUser(failPayload)

                expect(response).to.haveOwnProperty("code").that.equal(500)
            })
        })
    })
}