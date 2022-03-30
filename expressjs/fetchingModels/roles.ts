import { Knex } from "knex";
import { RoleDatabaseInstance } from "../dbModels/roles";
import { InnerErrorInterface } from "../interfaces/errors";
import { RoleDatabaseInterface } from "../interfaces/roles";



class RoleFetchingModel {
    protected roleDatabaseInstance

    constructor() {
        this.roleDatabaseInstance = RoleDatabaseInstance
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

    async getVisitorRole () {
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

    async getCashierRole () {
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

    async getUserRole (idUser: number, idRole: number): Promise<RoleDatabaseInterface | InnerErrorInterface> {
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

export const RoleFetchingInstance = new RoleFetchingModel()