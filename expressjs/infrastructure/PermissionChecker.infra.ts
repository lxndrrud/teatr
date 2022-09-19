import { DatabaseConnection } from "../databaseConnection";
import { User } from "../entities/users";
import { EmailingTypeRepo } from "../repositories/EmailingType.repo";
import { UserRepo } from "../repositories/User.repo";
import { Hasher } from "../utils/hasher";
import { Tokenizer } from "../utils/tokenizer";

export interface IPermissionChecker {
    check_CanHaveMoreThanOneReservationOnSession(user: User): Promise<boolean>
    check_CanSeeAllReservations(user: User): Promise<boolean>
    check_CanDeleteAnotherUserReservations(user: User): Promise<boolean>
    check_CanReserveWithoutConfirmation(user: User): Promise<boolean>
    check_CanIgnoreMaxSlotsValue(user: User): Promise<boolean>
    check_CanReserve(user: User): Promise<boolean>
    check_CanRestorePasswordByEmail(user: User): Promise<boolean>
    check_CanCreateUserActions(user: User): Promise<boolean>
}

export class PermissionChecker implements IPermissionChecker {
    public async check_CanHaveMoreThanOneReservationOnSession(user: User) {
        let result = user.role.rolePermissions.findIndex((rolePerm) => {
            return rolePerm.permission.code === 'ИМЕТЬ_БОЛЬШЕ_ОДНОЙ_БРОНИ'
        })

        return -1 !=  result
    }

    public async check_CanSeeAllReservations(user: User) {
        let result = user.role.rolePermissions.findIndex((rolePerm) => {
            return rolePerm.permission.code === 'ВИДЕТЬ_ВСЕ_БРОНИ'
        }) 

        return -1 != result
    }

    public async check_CanDeleteAnotherUserReservations(user: User) {
        let result = user.role.rolePermissions.findIndex((rolePerm) => {
            return rolePerm.permission.code === 'УДАЛЯТЬ_ЧУЖИЕ_БРОНИ'
        }) 

        return -1 != result
    }

    public async check_CanReserveWithoutConfirmation(user: User) {
        let result = user.role.rolePermissions.findIndex((rolePerm) => {
            return rolePerm.permission.code === 'БРОНЬ_БЕЗ_ПОДТВЕРЖДЕНИЯ'
        }) 

        return -1 != result
    }
    
    public async check_CanIgnoreMaxSlotsValue(user: User) {
        let result = user.role.rolePermissions.findIndex((rolePerm) => {
            return rolePerm.permission.code === 'ИГНОР_МАКС_МЕСТ_СЕАНСА'
        }) 

        return -1 != result
    }

    public async check_CanReserve(user: User) {
        let result = user.role.rolePermissions.findIndex((rolePerm) => {
            return rolePerm.permission.code === 'СОЗД_БРОНИ'
        }) 

        return -1 != result
    }

    public async check_CanRestorePasswordByEmail(user: User) {
        let result = user.role.rolePermissions.findIndex((rolePerm) => {
            return rolePerm.permission.code === 'ВОССТ_ПАРОЛЬ_ПО_ПОЧТЕ'
        }) 

        return -1 != result
    }

    public async check_CanCreateUserActions(user: User) {
        let result = user.role.rolePermissions.findIndex((rolePerm) => {
            return rolePerm.permission.code === 'ЗАПИСЫВАТЬ_ДЕЙСТВИЯ_В_ЖУРНАЛ'
        }) 

        return -1 != result
    }
}

export async function testPermissionChecker() {
    const userRepo = new UserRepo(
        DatabaseConnection, 
        new EmailingTypeRepo(DatabaseConnection), 
        new Hasher(), 
        new PermissionChecker(), 
        new Tokenizer())
    const checker = new PermissionChecker()

    let users = await userRepo.getAllUsers()

    console.log(users)

    for (let user of users) {
        console.log(user.role.title)
        console.log(await checker.check_CanReserve(user))
        console.log(await checker.check_CanDeleteAnotherUserReservations(user))
        console.log(await checker.check_CanHaveMoreThanOneReservationOnSession(user))
        console.log(await checker.check_CanIgnoreMaxSlotsValue(user))
        console.log(await checker.check_CanReserveWithoutConfirmation(user))
        console.log(await checker.check_CanSeeAllReservations(user))
        console.log(await checker.check_CanRestorePasswordByEmail(user))
    }
} 