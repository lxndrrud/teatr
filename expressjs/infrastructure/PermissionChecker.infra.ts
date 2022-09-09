import { DatabaseConnection } from "../databaseConnection";
import { User } from "../entities/users";
import { UserRepo } from "../repositories/User.repo";

export interface IPermissionChecker {
    check_CanHaveMoreThanOneReservationOnSession(user: User): Promise<boolean>
    check_CanSeeAllReservations(user: User): Promise<boolean>
    check_CanDeleteAnotherUserReservations(user: User): Promise<boolean>
    check_CanReserveWithoutConfirmation(user: User): Promise<boolean>
    check_CanIgnoreMaxSlotsValue(user: User): Promise<boolean>
    check_CanReserve(user: User): Promise<boolean>
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
}

export async function testPermissionChecker() {
    const userRepo = new UserRepo(DatabaseConnection)
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
    }
} 