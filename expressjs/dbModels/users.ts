import { Knex } from "knex"
import { KnexConnection } from "../knex/connections"
import { IExtendedUser, UserBaseInterface, UserInterface, UserRequestOption } from "../interfaces/users"
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken'
import { DatabaseModel } from "./baseModel";
import { roles, userActions, users } from "./tables";
import { UserActionBaseInterface } from "../interfaces/userActions";

export interface UserModel {
    getAll(payload: {
        id?: number
        email?: string
        password?: string
        token?: string
        firstname?: string
        middlename?: string
        lastname?: string
        id_role?: number
    }): Knex.QueryBuilder | any

    get(payload: {
        id?: number
        email?: string
        password?: string
        token?: string
        firstname?: string
        middlename?: string
        lastname?: string
        id_role?: number
    }): Knex.QueryBuilder | any

    insert(trx: Knex.Transaction, payload: UserBaseInterface): Knex.QueryBuilder | any

    update(trx: Knex.Transaction<any, any[]>, id: number, payload: UserInterface): Knex.QueryBuilder | any

    delete(trx: Knex.Transaction<any, any[]>, id: number): Knex.QueryBuilder | any

    insertAction(trx: Knex.Transaction, payload: UserActionBaseInterface): Knex.QueryBuilder | any

    generateToken(trx: Knex.Transaction, idUser: number, token: string): Knex.QueryBuilder | any

    checkIsUserStaff(idUser: number, idRole: number): Knex.QueryBuilder | any

    getUser(idUser: number): Knex.QueryBuilder | any
}

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

export class UserDatabaseModel extends DatabaseModel implements UserModel {
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
        return KnexConnection<IExtendedUser>(users)
            .select(
                `${users}.*`, 'r.title as role_title'
            )
            .join(`${roles} as r`, 'r.id', `${users}.id_role`)
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

    insertAction(trx: Knex.Transaction, payload: UserActionBaseInterface) {
        return trx(userActions)
            .insert(payload)
            .returning('*')
    }

    generateToken(trx: Knex.Transaction, idUser: number, token: string) {
        return trx<UserInterface>(users)
            .where({
                id: idUser
            })
            .update({
                token
            })
            .returning('*')
    }

    checkIsUserStaff(idUser: number, idRole: number) {
        return KnexConnection(`${users} as u`)
            .select('u.*')
            .join(`${roles} as r`, 'r.id', 'u.id_role')
            .where('u.id', idUser)
            .andWhere('u.id_role', idRole)
            .andWhere(builder => {
                builder.whereNot('r.title', 'Посетитель')
            })
            .first()
    }

    getUser(idUser: number) {
        return KnexConnection(`${users} as u`)
            .select(
                'u.*', 'r.title as role_title'
            )
            .join(`${roles} as r`, 'r.id', 'u.id_role')
            .where('u.id', idUser)
            .first()
    }
    
}
