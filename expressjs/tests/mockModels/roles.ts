import { Knex } from "knex"
import { title } from "process"
import { RoleModel } from "../../dbModels/roles"
import { RoleBaseInterface, RoleDatabaseInterface } from "../../interfaces/roles"


export class RoleMockModel implements RoleModel {
    public rolesList: RoleDatabaseInterface[]
    constructor() {
        this.rolesList = [
            {
                id: 3,
                title: "Посетитель",
                can_access_private: false,
                can_avoid_max_slots_property: false,
                can_have_more_than_one_reservation_on_session: false,
                can_make_reservation_without_confirmation: false,
                can_see_all_reservations: false
            }
        ]
    }

    getAll(payload: {
        id?: number 
        title?: string,
        can_see_all_reservations?: boolean,
        can_have_more_than_one_reservation_on_session?: boolean,
        can_access_private?: boolean,
        can_make_reservation_without_confirmation?: boolean
    }) {
        return this.rolesList
    }

    get(payload: {
        id?: number 
        title?: string,
        can_see_all_reservations?: boolean,
        can_have_more_than_one_reservation_on_session?: boolean,
        can_access_private?: boolean,
        can_make_reservation_without_confirmation?: boolean
    }) {
        if (payload.id === 500) throw new Error("Database mock error")
        for (const role of this.rolesList) {
            if (payload.id && role.id === payload.id) return role
            if (payload.title && role.title === payload.title) return role
        } 
        return undefined
    }

    insert(trx: Knex.Transaction, payload: RoleBaseInterface) {
        if (payload.title === "fail") throw new Error("Database mock error")
        this.rolesList.push(<RoleDatabaseInterface>{
            id: this.rolesList.length + 1,
            title: payload.title,
            can_access_private: payload.can_access_private,
            can_have_more_than_one_reservation_on_session: payload.can_have_more_than_one_reservation_on_session,
            can_avoid_max_slots_property: payload.can_avoid_max_slots_property,
            can_see_all_reservations: payload.can_see_all_reservations,
            can_make_reservation_without_confirmation: payload.can_make_reservation_without_confirmation
        })
    }

    update(trx: Knex.Transaction, id: number, payload: RoleBaseInterface) {
        if (payload.title === "fail") throw new Error("Database mock error")
        for (const role of this.rolesList) {
            if (role.id === id) {
                role.title = payload.title
            }
        } 
        return undefined
    }

    delete(trx: Knex.Transaction, id: number) {
        if (id === 500) throw new Error("Database mock error")
        for (let i=0; i<this.rolesList.length; i++) {
            if (this.rolesList[i].id === id) this.rolesList.splice(i, 1)
        }
    }

    getUserRole(idUser: number, idRole: number) {
        if (idUser === 500 || idRole === 500) throw new Error("Database mock error")
        if (idUser === 1 && idRole === 3) return this.rolesList[0]
    }
}