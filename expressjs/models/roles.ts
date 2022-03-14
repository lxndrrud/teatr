import { Knex } from "knex";
import { KnexConnection } from "../knex/connections";
import { RoleDatabaseInterface } from "../interfaces/roles";

export const getRoleByTitle = (title: string) => {
    return KnexConnection<RoleDatabaseInterface>('roles')
        .where({
            title
        })
        .first()
}

export const getAdminRole = () => getRoleByTitle('Админ')
export const getVisitorRole = () => getRoleByTitle('Посетитель')
export const getCashierRole = () => getRoleByTitle('Кассир')