import { expect } from "chai"
import { RoleFetchingModel } from "../../fetchingModels/roles"
import { UserFetchingModel } from "../../fetchingModels/users"
import { UserBaseInterface } from "../../interfaces/users"
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

            it("should fail and have inner error code 409", async function() {
                const failPayload = <UserBaseInterface>{
                    email: userMockModel.usersList[0].email,
                    password: userMockModel.usersList[0].password,
                }
                const response = await userService.createUser(failPayload)

                expect(response).to.haveOwnProperty("code").that.equals(409)
            })
        })
    })
}