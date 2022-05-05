import { app } from "../../app";
import { KnexConnection } from "../../knex/connections";
import { PlaysControllerTests } from "./plays";
import { ReservationsControllerTest } from "./reservations";
import { SessionsControllerTest } from "./sessions";
import { UsersControllerTests } from "./users";

export function ControllersTests() {
    before(async function() {
        await KnexConnection.migrate.rollback()
        await KnexConnection.migrate.latest()
        await KnexConnection.seed.run()

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
        UsersControllerTests()
    })
}