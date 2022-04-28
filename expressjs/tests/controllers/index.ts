import { app } from "../../app";
import { PlaysControllerTests } from "./plays";
import { ReservationsControllerTest } from "./reservations";
import { SessionsControllerTest } from "./sessions";

export function ControllersTests() {
    before(function() {
        this.apiLink = "/expressjs"
        this.authLink = `${this.apiLink}/users/login`
        this.server = app.listen(8083, () => {
            console.log(`⚡️[test-server]: Test Server is running at https://localhost:8083`)
        })
    })
    after(function() {
        this.server.close()
    })
    describe("Controllers", function() {
        PlaysControllerTests()
        SessionsControllerTest()
        ReservationsControllerTest()
    })
}