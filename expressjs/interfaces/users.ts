export interface UserBaseInterface {
    email: string
    password: string
    id_role: number
    firstname?: string
    middlename?: string
    lastname?: string
}

export interface UserBaseVisitorInterface extends Omit<UserBaseInterface, 'id_role'> {}
export interface UserBaseRoleInterface extends Omit<UserBaseInterface, 'id_role'> {
    role_title: string
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

export const isUserLoginInterface = (obj: any): obj is UserLoginInterface => {
    return obj 
        && obj.email && typeof obj.email === 'string'
        && obj.password && typeof obj.password === 'string'
}

export interface UserRegisterInterface extends UserLoginInterface {
    /**
     * *It is a 'copy' of UserBaseInterface, but without id_role
     */
    firstname?: string
    middlename?: string
    lastname?: string
}

export const isUserRegisterInterface = (obj: any): obj is UserRegisterInterface => {
    return obj 
        && obj.email && typeof obj.email === 'string'
        && obj.password && typeof obj.password === 'string'
}

export interface UserRequestOption {
    id: number
    email: string
    id_role: number
}

export interface IExtendedUser extends UserInterface{
    role_title: string
}

export interface IUserChangePassword {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export interface IUserPersonalInfo {
    firstname: string
    middlename: string
    lastname: string
}

export class UserStrategy {
    protected user: IExtendedUser

    constructor(userInstance: IExtendedUser) {
        this.user = userInstance
    }

    public static getExtendedPersonalList(userInstances: IExtendedUser[]) {
        let resultList = []
        for (let instance of userInstances) {
            resultList.push(new UserStrategy(instance).getExtendedPersonalInfo())
        }
        return resultList
    }

    public getPersonalInfo() {
        return {
            email: this.user.email.slice(0, 2) + "***" + this.user.email.slice(-5, ),
            firstname: this.user.firstname,
            middlename: this.user.middlename,
            lastname: this.user.lastname,
        }
    }

    public getExtendedPersonalInfo() {
        return {
            ...this.getPersonalInfo(),
            id: this.user.id,
            id_role: this.user.id_role,
            role_title: this.user.role_title
        }
    }
}
