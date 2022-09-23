import { UploadedFile } from "express-fileupload";
import { Knex } from "knex";
import fs from 'fs'
import csvParser from "csv-parser"
import { FileStreamHelper } from "../../utils/fileStreams";
import { UserBaseInterface, UserRequestOption } from "../../interfaces/users";
import { InnerError } from "../../interfaces/errors";
import { IRoleRepo } from '../../repositories/Role.repo'
import { IUserRepo } from "../../repositories/User.repo";



export interface IUserCSVService {
    createUsersCSV(user: UserRequestOption, file: UploadedFile): Promise<string[]>
}

export class UserCSVService implements IUserCSVService {
    protected connection 
    protected roleRepo
    protected fileStreamHelper
    private userRepo

    constructor (    
        connectionInstance: Knex<any, unknown[]>,
        roleRepoInstance: IRoleRepo,
        fileStreamHelperInstance: FileStreamHelper,
        userRepoInstance: IUserRepo
    ) {
        this.connection = connectionInstance
        this.fileStreamHelper = fileStreamHelperInstance
        this.roleRepo = roleRepoInstance
        this.userRepo = userRepoInstance
    }

    public async createUsersCSV(user: UserRequestOption, file: UploadedFile) {
        // Преобразовать CSV-файл в массив хеш-мап
        const data = await this.fileStreamHelper
            .readData(fs.createReadStream(file.tempFilePath).pipe(csvParser()))

        let counter = 1
        let errors: string[] = []
        for (const chunk of data) {
            let idRole: number
            try {
                if (!chunk['Почта']) {
                    throw `В строке #${counter} не указана почта пользователя`
                }
                if (!chunk['Пароль']) {
                    throw `В строке #${counter} не указан пароль пользователя`
                }
                if (!chunk['Роль']) {
                    throw `В строке #${counter} не указана роль пользователя`
                }

                // Получение идентификатора роли
                const role = await this.roleRepo.getRoleByTitle(chunk['Роль'])
                if (!role) {
                    throw new InnerError("Роль не найдена.", 404)
                }
                idRole = role.id
            } catch(e) {
                errors.push(<string> e)
                counter++
                continue
            }

            const userInfo: UserBaseInterface = {
                email: chunk['Почта'],
                password: chunk['Пароль'],
                id_role: idRole,
                firstname: chunk['Имя'] ? chunk['Имя'] : undefined,
                middlename: chunk['Отчество'] ? chunk['Отчество'] : undefined,
                lastname: chunk['Фамилия'] ? chunk['Фамилия'] : undefined
            }
            // Проверка на существование пользователя
            const check = await this.userRepo.getUserByEmail(userInfo.email)
            if (check) {
                errors.push(`Строка #${counter}: пользователь с почтой ${check.email} уже существует!`)
                counter++
                continue
            }
            try {
                // Создание пользователя
                await this.userRepo.createUser(userInfo)
                // Создание действия для журнала действий работников
                const message = `Пользователь ${user.email} создает через CSV нового пользователя почта: ${userInfo.email}, роль: ${userInfo.id_role}`
                await this.userRepo.createUserAction(
                    user.id,
                    message)
            } catch (error) {
                errors.push(<string> error)
            }
            counter++
        }
        return errors
    }
}