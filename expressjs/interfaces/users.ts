export interface UserBaseInterface {
    email: string
    password: string
    id_role: number
    firstname?: string
    middlename?: string
    lastname?: string
}

export interface UserInterface extends UserBaseInterface {
    id: number
    firstname: string
    middlename: string
    lastname: string
    token?: string
}

export interface UserLoginInterface {
    email: string
    password: string
}

export interface UserRegisterInterface extends UserLoginInterface {
    /**
     * *It is a 'copy' of UserBaseInterface, but without id_role
     */
    firstname?: string
    middlename?: string
    lastname?: string
}

export interface UserRequestOption {
    id: number
    email: string
    id_role: number
}
