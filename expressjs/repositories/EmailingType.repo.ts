import { DataSource } from "typeorm/data-source/DataSource";
import { EmailingType } from "../entities/emailing_types";

export interface IEmailingTypeRepo {
    getUserRestorationType(): Promise<EmailingType | null>
}

export class EmailingTypeRepo implements IEmailingTypeRepo {
    private connection
    private emailingTypeRepo

    constructor(
        connectionInstance: DataSource
    ) {
        this.connection = connectionInstance
        this.emailingTypeRepo = this.connection.getRepository(EmailingType)
    }

    public async getUserRestorationType() {
        let userType = await this.emailingTypeRepo.findOne({
            where: {
                title: 'Восстановление пароля'
            }
        })

        return userType
    } 
}
