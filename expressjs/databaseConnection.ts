import { DataSource } from "typeorm"
import 'dotenv/config'
import { User } from "./entities/users"
import { Role } from "./entities/roles"
import { Permission } from "./entities/permissions"
import { RolePermission } from "./entities/roles_permissions"
import { testPermissionChecker } from "./infrastructure/PermissionChecker.infra"
import { UserAction } from "./entities/user_actions"
import { Reservation } from "./entities/reservations"
import { EmailingType } from "./entities/emailing_types"
import { ReservationEmailing } from "./entities/reservations_emailings"
import { UserRestoration } from "./entities/users_restorations"
import { Auditorium } from "./entities/auditoriums"
import { Play } from "./entities/plays"
import { PricePolicy } from "./entities/price_policies"
import { ReservationSlot } from "./entities/reservations_slots"
import { Row } from "./entities/rows"
import { Seat } from "./entities/seats"
import { Session } from "./entities/sessions"
import { Slot } from "./entities/slots"
import { PlayImage } from "./entities/plays_images"
import { Image } from "./entities/images"


export const DatabaseConnection = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        User, Role, Permission, RolePermission, UserAction, Reservation,
        EmailingType, ReservationEmailing, UserRestoration,
        Auditorium, Play, PricePolicy, ReservationSlot, Row, Seat, Session, Slot,
        Image, PlayImage
    ],
    synchronize: false,
    logging: false
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