import { Knex } from "knex";
import { UserModel } from "../../dbModels/users";
import { UserActionBaseInterface, UserActionDatabaseInterface } from "../../interfaces/userActions";
import { UserBaseInterface, UserInterface } from "../../interfaces/users";


export class UserMockModel implements UserModel {
    public usersList: UserInterface[]
    public userActionsList: UserActionDatabaseInterface[]
    public userPayload: UserBaseInterface
    constructor() {
        this.usersList = [
            {
                id: 1,
                email: "test",
                // 123456
                password: '$2a$10$.7sVPajSPR/JTa4g8tWToe7O31A0Gz4EnL6TA8BzMaD8IAxXbFqwS',
                token: "token",
                firstname: "test firstname 1",
                middlename: "test middlename 1",
                lastname: "test lastname 1",
                id_role: 3
            },
            {
                id: 2,
                email: "admin",
                // 123456
                password: '$2a$10$.7sVPajSPR/JTa4g8tWToe7O31A0Gz4EnL6TA8BzMaD8IAxXbFqwS',
                token: "token",
                firstname: "test firstname 2",
                middlename: "test middlename 2",
                lastname: "test lastname 2",
                id_role: 4
            },
            {
                id: 500,
                email: "fail token",
                // 123456
                password: '$2a$10$.7sVPajSPR/JTa4g8tWToe7O31A0Gz4EnL6TA8BzMaD8IAxXbFqwS',
                token: "token",
                firstname: "test firstname 1",
                middlename: "test middlename 1",
                lastname: "test lastname 1",
                id_role: 3
            }
        ]
        this.userActionsList = [
            {
                id: 1,
                created_at: "2022-05-06",
                id_user: 1,
                description: "asdasda"
            }
        ] 
        this.userPayload = {
            email: "test@test.ru",
            firstname: "test firstname 1",
            middlename: "test middlename 1",
            lastname: "test lastname 1",
            password: "123456",
            id_role: 3
        }
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
        return this.usersList
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
        if (payload.id && payload.id === 500) {
            throw new Error("Database mock error")
        }
        if(payload.email && payload.email === "fail")
            throw new Error("Database mock error")
        for (const user of this.usersList) {
            if (user.id && user.id === payload.id) {
                return user
            }
            if (user.email && user.email === payload.email) {
                return user
            }
        }
        return undefined
    }

    insert(trx: Knex.Transaction, payload: UserBaseInterface) {
        if (payload.firstname === "fail") throw new Error("Database mock error")
        const newUser = <UserInterface>{
            id: this.usersList.length + 1,
            id_role: payload.id_role,
            firstname: payload.firstname,
            middlename: payload.middlename,
            lastname: payload.lastname,
            email: payload.email,
            password: payload.password
        }
        this.usersList.push(newUser)
        return [newUser]
    }

    update(trx: Knex.Transaction<any, any[]>, id: number, payload: UserInterface) {
        if (id === 500) throw new Error("Database mock error")
        for (let user of this.usersList) {
            if (user.id === id) {
                user.firstname = payload.firstname
                user.middlename = payload.middlename
                user.lastname = payload.lastname
            }
        }
    }

    delete(trx: Knex.Transaction<any, any[]>, id: number) {
        if (id === 500) throw new Error("Database mock error")
        for (let i=0; i<this.usersList.length; i++) {
            if (this.usersList[i].id === id) this.usersList.splice(i, 1)
        }
    }

    insertAction(trx: Knex.Transaction, payload: UserActionBaseInterface) {
        if (payload.description === "fail") throw new Error("Database mock error")
        this.userActionsList.push(<UserActionDatabaseInterface>{
            id: this.userActionsList.length + 1,
            description: payload.description,
            id_user: payload.id_user
        })
    }

    generateToken(trx: Knex.Transaction, idUser: number, token: string) {
        if (idUser === 500) throw new Error("Database mock error")
        const toReturn: UserInterface[] = []
        for (let i=0; i<this.usersList.length; i++) {
            if (this.usersList[i].id === idUser) {
                this.usersList[i].token = token
                toReturn.push( this.usersList[i])
            }
        }
        return toReturn
    }

    checkIsUserStaff(idUser: number, idRole: number) {
        if (idRole === 3) return false
        return true
    }

    checkIsUserAdmin(idUser: number, idRole: number) {
        if (idRole === 3) return false
        return true
    }

    getUser(idUser: number) {
        this.usersList.forEach(user => {
            if (user.id === idUser) {
                return user
            }
        })
        return undefined
    }
}