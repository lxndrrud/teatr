import { Knex } from "knex"
import { KnexConnection } from "../knex/connections"
import { UserBaseInterface, UserInterface, UserRequestOption } from "../interfaces/users"
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken'
import { DatabaseModel } from "./baseModel";
import { users } from "./tables";

/**
 * id
 * email
 * password
 * token
 * firstname
 * middlename
 * lastname
 * id_role
 */

class UserDatabaseModel extends DatabaseModel {
    constructor() {
        super(users)
    }

    getAll(payload: {
        id?: number
        email?: string
        password?: string
        token?: string
        firstname?: string
        middlename?: string
        lastname?: string
        id_role?: number
    }) {
        return KnexConnection(users)
            .where(builder => {
                if (payload.id)
                    builder.andWhere(`${users}.id`, payload.id)
                if (payload.email)
                    builder.andWhere(`${users}.email`, payload.email)
                if (payload.password)
                    builder.andWhere(`${users}.password`, payload.password)
                if (payload.token)
                    builder.andWhere(`${users}.token`, payload.token)
                if (payload.firstname)
                    builder.andWhere(`${users}.firstname`, payload.firstname)
                if (payload.middlename)
                    builder.andWhere(`${users}.middlename`, payload.middlename)
                if (payload.lastname)
                    builder.andWhere(`${users}.lastname`, payload.lastname)
                if (payload.id_role)
                    builder.andWhere(`${users}.id_role`, payload.id_role)
            })
    }

    get(payload: {
        id?: number
        email?: string
        password?: string
        token?: string
        firstname?: string
        middlename?: string
        lastname?: string
        id_role?: number
    }) {
        return this.getAll(payload).first()
    }

    insert(trx: Knex.Transaction, payload: UserBaseInterface) {
        return trx(users)
            .insert(payload)
            .returning('*')
    }

    update(trx: Knex.Transaction<any, any[]>, id: number, payload: UserInterface) {
        return trx(users)
            .update(payload)
            .where(`${users}.id`, id)
    }

    delete(trx: Knex.Transaction<any, any[]>, id: number) {
        return trx(users)
            .where(`${users}.id`, id)
            .del()
    }
}


export const UserDatabaseInstance = new UserDatabaseModel()