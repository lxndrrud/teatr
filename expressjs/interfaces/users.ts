export interface UserBaseInterface {
    email: string
    password: string
    firstname?: string
    middlename?: string
    lastname?: string
}

export interface UserInterface extends UserBaseInterface {
    id: number
    firstname: string
    middlename: string
    lastname: string
    token: string
}

export interface UserLoginInterface {
    email: string
    password: string
}
