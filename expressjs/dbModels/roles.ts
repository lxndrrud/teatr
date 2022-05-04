import { Knex } from "knex";
import { DatabaseModel } from "./baseModel";
import { KnexConnection } from "../knex/connections";
import { roles, users } from "./tables";

export interface RoleModel {
    getAll(payload: {
        id?: number 
        title?: string,
        can_see_all_reservations?: boolean,
        can_have_more_than_one_reservation_on_session?: boolean,
        can_access_private?: boolean,
        can_make_reservation_without_confirmation?: boolean
    }): Knex.QueryBuilder

    get(payload: {
        id?: number 
        title?: string,
        can_see_all_reservations?: boolean,
        can_have_more_than_one_reservation_on_session?: boolean,
        can_access_private?: boolean,
        can_make_reservation_without_confirmation?: boolean
    }): Knex.QueryBuilder

    insert(trx: Knex.Transaction, payload: {
        title: string,
        can_see_all_reservations: boolean,
        can_have_more_than_one_reservation_on_session: boolean,
        can_access_private: boolean,
        can_make_reservation_without_confirmation: boolean
    }): Knex.QueryBuilder

    update(trx: Knex.Transaction, id: number, payload: {
        title?: string,
        can_see_all_reservations?: boolean,
        can_have_more_than_one_reservation_on_session?: boolean,
        can_access_private?: boolean,
        can_make_reservation_without_confirmation?: boolean
    }): Knex.QueryBuilder

    delete(trx: Knex.Transaction, id: number): Knex.QueryBuilder

    getUserRole(idUser: number, idRole: number): Knex.QueryBuilder
}

/**
 * Role
 * id: number 
 * title: string,
 * can_see_all_reservations: boolean,
 * can_have_more_than_one_reservation_on_session: boolean,
 * can_access_private: boolean,
 * can_make_reservation_without_confirmation: boolean
 */
export class RoleDatabaseModel extends DatabaseModel implements RoleModel {
    constructor() {
        super(roles)
    }

    getAll(payload: {
        id?: number 
        title?: string,
        can_see_all_reservations?: boolean,
        can_have_more_than_one_reservation_on_session?: boolean,
        can_access_private?: boolean,
        can_make_reservation_without_confirmation?: boolean
    }) {
        return KnexConnection(roles)
            .where(builder => {
                if (payload.id)
                    builder.andWhere(`${roles}.id`, payload.id)
                if (payload.title)
                    builder.andWhere(`${roles}.title`, payload.title)
                if (payload.can_see_all_reservations)
                    builder.andWhere(`${roles}.can_see_all_reservations`, payload.can_see_all_reservations)
                if (payload.can_have_more_than_one_reservation_on_session)
                    builder.andWhere(`${roles}.can_have_more_than_one_reservation_on_session`, payload.can_have_more_than_one_reservation_on_session)
                if (payload.can_access_private)
                    builder.andWhere(`${roles}.can_access_private`, payload.can_access_private)
                if (payload.can_make_reservation_without_confirmation)
                    builder.andWhere(`${roles}.can_make_reservation_without_confirmation`, payload.can_make_reservation_without_confirmation)
            })
    }

    get(payload: {
        id?: number 
        title?: string,
        can_see_all_reservations?: boolean,
        can_have_more_than_one_reservation_on_session?: boolean,
        can_access_private?: boolean,
        can_make_reservation_without_confirmation?: boolean
    }) {
        return this.getAll(payload).first()
    }

    insert(trx: Knex.Transaction, payload: {
        title: string,
        can_see_all_reservations: boolean,
        can_have_more_than_one_reservation_on_session: boolean,
        can_access_private: boolean,
        can_make_reservation_without_confirmation: boolean
    }) {
        return trx(roles)
            .insert(payload)
            .returning('*')
    }

    update(trx: Knex.Transaction, id: number, payload: {
        title?: string,
        can_see_all_reservations?: boolean,
        can_have_more_than_one_reservation_on_session?: boolean,
        can_access_private?: boolean,
        can_make_reservation_without_confirmation?: boolean
    }) {
        return trx(roles)
            .update(payload)
            .where(`${roles}.id`, id)
    }

    delete(trx: Knex.Transaction, id: number) {
        return trx(roles)
            .where(`${roles}.id`, id)
            .del()
    }

    getUserRole(idUser: number, idRole: number) {
        return this.get({})
            /*
            .select(
                KnexConnection.ref('*').withSchema(roles)
            )
            */
            .where(`${users}.id_role`, idRole)
            .andWhere(`${users}.id`, idUser)
            .join(users, `${users}.id_role`, `${roles}.id`)
    }
}
