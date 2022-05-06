import { PlayServiceTests } from "./plays";
import { UserServiceTests } from "./users";

export function ServicesTests() {
    describe("Services Tests", function() {
        PlayServiceTests()
        UserServiceTests()
    })
}