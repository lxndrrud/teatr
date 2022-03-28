import { Knex } from "knex";
import { RoleDatabaseModel } from "../dbModels/roles";
import { RoleDatabaseInterface } from "../interfaces/roles";
import { roles, users } from "../dbModels/tables";



export class RoleFetchingModel {
    getRoleByTitle (title: string): Promise<RoleDatabaseInterface> {
        return new RoleDatabaseModel().get({
            title: title
        })
    }
    
    getAdminRole() {
        return this.getRoleByTitle('Администратор')
    }

    getVisitorRole () {
        return this.getRoleByTitle('Посетитель')
    } 

    getCashierRole () {
        return this.getRoleByTitle('Кассир')
    }

    getUserRole (idUser: number, idRole: number): Promise<RoleDatabaseInterface | undefined> {
        return new RoleDatabaseModel().get({})
            .where(`${users}.id_role`, idRole)
            .andWhere(`${users}.id`, idUser)
            .join(`${users}`, `${users}.id_role`, `${roles}.id`)
            .first()
    }
    
}