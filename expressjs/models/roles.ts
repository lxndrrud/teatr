import { Knex } from "knex";
import { KnexConnection } from "../knex/connections";
import { RoleDatabaseInterface } from "../interfaces/roles";

export const getRoleByTitle = (title: string) => {
    return KnexConnection<RoleDatabaseInterface>('roles')
        .where('title', title)
        .first()
}

export const getAdminRole = () => getRoleByTitle('Админ')
export const getVisitorRole = () => getRoleByTitle('Посетитель')
export const getCashierRole = () => getRoleByTitle('Кассир')


export const getUserRole = (idUser: number, idRole: number): Promise<RoleDatabaseInterface | undefined> => {
    return KnexConnection<RoleDatabaseInterface>('roles')
        .where('users.id_role', idRole)
        .andWhere('users.id', idUser)
        .join('users', 'users.id_role', 'roles.id')
        .first()
}

