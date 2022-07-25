import { Knex } from "knex";
import { RoleModel } from "../dbModels/roles";
import { InnerErrorInterface } from "../interfaces/errors";
import { RoleDatabaseInterface } from "../interfaces/roles";


export interface RoleService {
    getRoleByTitle (title: string): Promise<RoleDatabaseInterface>
    getAdminRole(): Promise<RoleDatabaseInterface | InnerErrorInterface>
    getVisitorRole(): Promise<RoleDatabaseInterface | InnerErrorInterface>
    getCashierRole(): Promise<RoleDatabaseInterface | InnerErrorInterface>
    getUserRole (idUser: number, idRole: number): Promise<InnerErrorInterface | RoleDatabaseInterface>

}


export class RoleFetchingModel implements RoleService {
    protected roleDatabaseInstance

    constructor(roleDatabaseModel: RoleModel) {
        this.roleDatabaseInstance = roleDatabaseModel
    }
    
    getRoleByTitle (title: string): Promise<RoleDatabaseInterface> {
        return this.roleDatabaseInstance.get({
            title: title
        })
    }
    
    async getAdminRole() {
        try {
            const query = await this.getRoleByTitle('Администратор')
            return query
        } catch(e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера во время поиска роли!'
            }
        }
    }

    async getVisitorRole() {
        try {
            const query = await this.getRoleByTitle('Посетитель')
            return query
        } catch(e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера во время поиска роли!'
            }
        }
    } 

    async getCashierRole() {
        try {
            const query = await this.getRoleByTitle('Кассир')
            return query
        } catch(e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера во время поиска роли!'
            }
        }
    }

    async getUserRole (idUser: number, idRole: number) {
        try {
            const query: RoleDatabaseInterface = await this.roleDatabaseInstance
                .getUserRole(idUser, idRole)
            if (!query) {
                return <InnerErrorInterface>{
                    code: 404,
                    message: 'Запись роли не найдена!'
                }
            }
            return query
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера во время поиска роли!'
            }
        }
        
    }
    
}