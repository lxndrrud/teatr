import { InnerError, InnerErrorInterface } from '../interfaces/errors'
import { IUserChangePassword, IUserPersonalInfo } from '../interfaces/users'


export interface IUserGuard {
    changePersonalInfoProcessing(info: IUserPersonalInfo): IUserPersonalInfo
    changePasswordValidation(passwordInfo: IUserChangePassword): void
}

export class UserGuard implements IUserGuard {
    public changePersonalInfoProcessing(personalInfo: IUserPersonalInfo): IUserPersonalInfo {
        if (!personalInfo.firstname) personalInfo.firstname = 'Не указано'
        if (!personalInfo.middlename) personalInfo.middlename = 'Не указано'
        if (!personalInfo.lastname) personalInfo.lastname = 'Не указано'
        return personalInfo
    }

    public changePasswordValidation(passwordInfo: IUserChangePassword) {
        // Проверка на совпадение старого пароля с новым
        if (passwordInfo.oldPassword === passwordInfo.newPassword) 
            throw new InnerError("Старый пароль совпадает с новым!",400)

        // Проверка на совпадение нового пароля с подтверджением
        if (passwordInfo.newPassword !== passwordInfo.confirmPassword) 
            throw new InnerError("Новый пароль не совпадает с подтверждением!", 400)
    }
}