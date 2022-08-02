import { InnerErrorInterface } from '../interfaces/errors'
import { IUserChangePassword, IUserPersonalInfo } from '../interfaces/users'


export interface IUserGuard {
    changePersonalInfoProcessing(info: IUserPersonalInfo): IUserPersonalInfo
    changePasswordValidation(passwordInfo: IUserChangePassword): InnerErrorInterface | undefined
}

export class UserGuard implements IUserGuard {
    public changePersonalInfoProcessing(personalInfo: IUserPersonalInfo): IUserPersonalInfo {
        if (!personalInfo.firstname) personalInfo.firstname = 'Не указано'
        if (!personalInfo.middlename) personalInfo.middlename = 'Не указано'
        if (!personalInfo.lastname) personalInfo.lastname = 'Не указано'
        return personalInfo
    }

    public changePasswordValidation(passwordInfo: IUserChangePassword): InnerErrorInterface | undefined {
        // Проверка на совпадение старого пароля с новым
        if (passwordInfo.oldPassword === passwordInfo.newPassword) {
            return <InnerErrorInterface>{
                code: 400, 
                message: "Старый пароль совпадает с новым!"
            }
        }

        // Проверка на совпадение нового пароля с подтверджением
        if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            return <InnerErrorInterface>{
                code: 400, 
                message: "Новый пароль не совпадает с подтверждением!"
            }
        }
    }
}