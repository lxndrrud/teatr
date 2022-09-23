export interface IUserInfrastructure {
    generateRestorePasswordEmailMessage(code: string): {
        subject: string;
        message: string;
    }
}

export class UserInfrastructure implements IUserInfrastructure {
    /**
     * * Сгенерировать письмо для восстановления пароля
     */
    public generateRestorePasswordEmailMessage(code: string) {
        return {
            subject: 'Восстановление пароля на "Брони на Оборонной"',
            message: `Ваш новый пароль: ${code}\nРекомендуем Вам сменить его на постоянный во вкладке Аккаунт.`
        } 
    }

}