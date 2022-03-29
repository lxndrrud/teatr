import { Knex } from "knex";
import { RoleDatabaseInstance } from "../dbModels/roles";
import { RoleDatabaseInterface } from "../interfaces/roles";
import { roles, users } from "../dbModels/tables";



export class RoleFetchingModel {
    protected roleDatabaseInstance

    constructor() {
        this.roleDatabaseInstance = RoleDatabaseInstance
    }
    
    getRoleByTitle (title: string): Promise<RoleDatabaseInterface> {
        return this.roleDatabaseInstance.get({
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

    async getUserRole (idUser: number, idRole: number): Promise<RoleDatabaseInterface | 404 | 500> {
        try {
            const query: RoleDatabaseInterface = await this.roleDatabaseInstance
                .getUserRole(idUser, idRole)
            if (!query) {
                return 404
            }
            return query
        } catch (e) {
            return 500
        }
        
    }
    
}

export const RoleFetchingInstance = new RoleFetchingModel()