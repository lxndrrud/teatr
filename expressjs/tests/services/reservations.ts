import { Knex } from "knex"
import { assert, should, expect } from "chai";
import { ReservationFetchingModel } from "../../fetchingModels/reservations";
import { ReservationMockModel } from "../mockModels/reservations";
import { RoleFetchingModel } from "../../fetchingModels/roles";
import { RoleMockModel } from "../mockModels/roles";
import { SessionFetchingModel } from "../../fetchingModels/sessions";

export function ReservationServiceTests() {
    describe("Reservation Service", () => {
        const reservationMockModel = new ReservationMockModel()
        const roleService = new RoleFetchingModel(new RoleMockModel)
    })
        
}