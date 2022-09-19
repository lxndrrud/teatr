import { UploadedFile } from "express-fileupload";
import { Knex } from "knex";
import fs from 'fs'
import csvParser from "csv-parser"
import { UserModel } from "../../dbModels/users";
import { FileStreamHelper } from "../../utils/fileStreams";
import { UserBaseInterface, UserRequestOption } from "../../interfaces/users";
import { RoleService } from "../roles";
import { InnerErrorInterface, isInnerErrorInterface } from "../../interfaces/errors";
import { Hasher } from "../../utils/hasher";
import { IUserRepo } from "../../repositories/User.repo";



export interface IUserCSVService {
    createUsersCSV(user: UserRequestOption, file: UploadedFile): Promise<string[]>
}

export class UserCSVService implements IUserCSVService {
    protected connection 
    protected userModel
    protected roleService
    protected fileStreamHelper
    protected hasher
    private userRepo

    constructor (    
        connectionInstance: Knex<any, unknown[]>,
        userModelInstance: UserModel, 
        roleServiceInstance: RoleService,
        fileStreamHelperInstance: FileStreamHelper,
        hasherInstance: Hasher,
        userRepoInstance: IUserRepo
    ) {
        this.connection = connectionInstance
        this.userModel = userModelInstance
        this.fileStreamHelper = fileStreamHelperInstance
        this.roleService = roleServiceInstance
        this.hasher = hasherInstance
        this.userRepo = userRepoInstance
    }

    public async createUsersCSV(user: UserRequestOption, file: UploadedFile) {
        // Преобразовать CSV-файл в массив хеш-мап
        const data = await this.fileStreamHelper
            .readData(fs.createReadStream(file.tempFilePath).pipe(csvParser()))

        let counter = 1
        let errors: string[] = []
        for (const chunk of data) {
            let hashedPassword = ''
            let idRole: number | InnerErrorInterface
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

                // Хэширование пароля
                hashedPassword = await this.hasher.hash(chunk['Пароль'])

                // Получение идентификатора роли
                idRole = await this.roleService.normalizeRole(chunk['Роль'])
                if (isInnerErrorInterface(idRole)) {
                    throw `В строке #${counter} возникла ошибка с определением роли: ${idRole.message}`
                }
            } catch(e) {
                errors.push(<string> e)
                counter++
                continue
            }

            let userInfo: UserBaseInterface = {
                email: chunk['Почта'],
                password: hashedPassword,
                id_role: idRole,
                firstname: chunk['Имя'] ? chunk['Имя'] : undefined,
                middlename: chunk['Отчество'] ? chunk['Отчество'] : undefined,
                lastname: chunk['Фамилия'] ? chunk['Фамилия'] : undefined
            }

            const check = await this.userRepo.getUserByEmail(userInfo.email)
            if (check) {
                errors.push(`Строка #${counter}: пользователь с почтой ${check.email} уже существует!`)
                counter++
                continue
            }

            const trx = await this.connection.transaction()
            try {
                // Создание пользователя
                await this.userModel.insert(trx, userInfo)

                // Создание действия для журнала действий работников
                const message = `Пользователь ${user.email} создает через CSV нового пользователя почта: ${userInfo.email}, роль: ${userInfo.id_role}`
                await this.userRepo.createUserAction(
                    user.id,
                    message)
                await trx.commit()
            } catch (e) {
                console.log(e)
                errors.push(<string> e)
                await trx.rollback()
            }
            counter++;
        }
        return errors
    }
}