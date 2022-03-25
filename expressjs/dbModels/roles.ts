import { Knex } from "knex";
import { DatabaseModel } from "./baseModel";
import { KnexConnection } from "../knex/connections";
import { roles } from "./tables";

export class RoleDatabaseModel extends DatabaseModel {
    constructor(connection: Knex<any, unknown[]> = KnexConnection) {
        super(connection, roles)
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

    insert(payload: {
        title: string,
        can_see_all_reservations: boolean,
        can_have_more_than_one_reservation_on_session: boolean,
        can_access_private: boolean,
        can_make_reservation_without_confirmation: boolean
    }) {
        return this.connection(roles)
            .insert(payload)
    }

    update(id: number, payload: {
        title?: string,
        can_see_all_reservations?: boolean,
        can_have_more_than_one_reservation_on_session?: boolean,
        can_access_private?: boolean,
        can_make_reservation_without_confirmation?: boolean
    }) {
        return this.connection(roles)
            .update(payload)
            .where(`${roles}.id`, id)
    }

    delete(id: number) {
        return this.connection(roles)
            .where(`${roles}.id`, id)
            .del()
    }
}