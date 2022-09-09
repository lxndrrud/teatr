import { DataSource } from "typeorm"
import 'dotenv/config'
import { User } from "./entities/users"
import { Role } from "./entities/roles"
import { Permission } from "./entities/permissions"
import { RolePermission } from "./entities/roles_permissions"
import { testPermissionChecker } from "./infrastructure/PermissionChecker.infra"
import { UserAction } from "./entities/user_actions"
import { Reservation } from "./entities/reservations"

export const DatabaseConnection = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        User, Role, Permission, RolePermission, UserAction, Reservation
    ],
    synchronize: false,
    logging: true
}) 

export async function InitConnection() {
    return DatabaseConnection.initialize()
    .then(async () => {
        console.log('⚡️⚡️⚡️ Подключение к базе установлено ⚡️⚡️⚡️')

        //await testPermissionChecker()
    })
    .catch((e) => {
        throw new Error(e)
    })
}