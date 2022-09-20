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
    check_HasAccessToAdmin(user: User): Promise<boolean>
    check_CanSeeUsersPersonalInfo(user: User): Promise<boolean>
}

export class PermissionChecker implements IPermissionChecker {
    private check(user: User, permissionCode: string) {
        let result = user.role.rolePermissions.findIndex((rolePerm) => {
            return rolePerm.permission.code === permissionCode
        })

        return -1 !=  result
    }
    public async check_CanHaveMoreThanOneReservationOnSession(user: User) {
        return this.check(user, 'ИМЕТЬ_БОЛЬШЕ_ОДНОЙ_БРОНИ')
    }

    public async check_CanSeeAllReservations(user: User) {
        return this.check(user, 'ВИДЕТЬ_ВСЕ_БРОНИ')
    }

    public async check_CanDeleteAnotherUserReservations(user: User) {
        return this.check(user, 'УДАЛЯТЬ_ЧУЖИЕ_БРОНИ')
    }

    public async check_CanReserveWithoutConfirmation(user: User) {
        return this.check(user, 'БРОНЬ_БЕЗ_ПОДТВЕРЖДЕНИЯ')
    }
    
    public async check_CanIgnoreMaxSlotsValue(user: User) {
        return this.check(user, 'ИГНОР_МАКС_МЕСТ_СЕАНСА')
    }

    public async check_CanReserve(user: User) {
        return this.check(user, 'СОЗД_БРОНИ')
    }

    public async check_CanRestorePasswordByEmail(user: User) {
        return this.check(user, 'ВОССТ_ПАРОЛЬ_ПО_ПОЧТЕ')
    }

    public async check_CanCreateUserActions(user: User) {
        return this.check(user, 'ЗАПИСЫВАТЬ_ДЕЙСТВИЯ_В_ЖУРНАЛ')
    }
    
    public async check_HasAccessToAdmin(user: User) {
        return this.check(user, 'ДОСТУП_К_АДМИНКЕ')
    }

    public async check_CanSeeUsersPersonalInfo(user: User) {
        return this.check(user, 'ПРОСМОТР_ЛИЧНОЙ_ИНФОРМАЦИИ')
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