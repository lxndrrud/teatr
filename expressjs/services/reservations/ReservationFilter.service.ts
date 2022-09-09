import { ReservationModel } from "../../dbModels/reservations";
import { User } from "../../entities/users";
import { IPermissionChecker } from "../../infrastructure/PermissionChecker.infra";
import { IReservationInfrastructure } from "../../infrastructure/Reservation.infra";
import { AuditoriumReservationFilterOption } from "../../interfaces/auditoriums";
import { InnerErrorInterface, isInnerErrorInterface } from "../../interfaces/errors";
import { PlayReservationFilterOptionInterface } from "../../interfaces/plays";
import { ReservationFilterQueryInterface, ReservationWithoutSlotsInterface, ReservationInterface } from "../../interfaces/reservations";
import { TimestampReservationFilterOptionDatabaseInterface, TimestampReservationFilterOptionInterface } from "../../interfaces/timestamps";
import { UserRequestOption } from "../../interfaces/users";
import { IUserRepo } from "../../repositories/User.repo";
import { TimestampHelper } from "../../utils/timestamp";
import { RoleService } from "../roles";

export interface IReservationFilterService {
    getReservationFilterOptions(user: UserRequestOption): Promise<InnerErrorInterface | {
        dates: TimestampReservationFilterOptionInterface[];
        auditoriums: AuditoriumReservationFilterOption[];
        plays: PlayReservationFilterOptionInterface[];
    }>

    getFilteredReservations(userQuery: ReservationFilterQueryInterface, user: UserRequestOption): 
    Promise<InnerErrorInterface | ReservationInterface[]>

}

export class ReservationFilterService implements IReservationFilterService {
    protected reservationModel
    protected roleService
    protected reservationInfrastructure
    protected timestampHelper
    protected userRepo
    protected permissionChecker

    constructor(
        reservationDatabaseInstance: ReservationModel,
        roleServiceInstance: RoleService,
        reservationInfrastructureInstance: IReservationInfrastructure,
        timestampHelperInstance: TimestampHelper,
        userRepoInstance: IUserRepo,
        permissionCheckerInstance: IPermissionChecker
    ) {
        this.reservationModel = reservationDatabaseInstance
        this.roleService = roleServiceInstance
        this.reservationInfrastructure = reservationInfrastructureInstance
        this.timestampHelper = timestampHelperInstance
        this.userRepo = userRepoInstance
        this.permissionChecker = permissionCheckerInstance
    }

    /**
     * * Получение значений для фильтра броней
     */
    public async getReservationFilterOptions(user: UserRequestOption) {
        // Проверка-получение роли
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUser(user.id)
            .catch(e => { throw e })
            
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!userDB) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Пользователь не найден!'
            }
        }

        // dates, auditoriums, plays but without isLocked, reservationNumber
        let timestamps: TimestampReservationFilterOptionDatabaseInterface[],
            auditoriums: AuditoriumReservationFilterOption[],
            plays: PlayReservationFilterOptionInterface[]

        try {
            if (await this.permissionChecker.check_CanSeeAllReservations(userDB))
                [timestamps, auditoriums, plays] = await Promise.all([
                    this.reservationModel.getTimestampsOptionsForReservationFilter(undefined),
                    this.reservationModel.getAuditoriumsOptionsForReservationFilter(undefined),
                    this.reservationModel.getPlaysOptionsForReservationFilter(undefined)
                ])
            else 
                [timestamps, auditoriums, plays] = await Promise.all([
                    this.reservationModel.getTimestampsOptionsForReservationFilter(user.id),
                    this.reservationModel.getAuditoriumsOptionsForReservationFilter(user.id),
                    this.reservationModel.getPlaysOptionsForReservationFilter(user.id)
                ])
                
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске значений для фильтра броней!'
            }
        }

        let dates: TimestampReservationFilterOptionInterface[] = []
        let distinctCheck: Map<string, string> = new Map()
        for (let row of timestamps) {
            const extendedDate = this.timestampHelper
                .extendedDateFromTimestamp(row.timestamp)
            const simpleDate = this.timestampHelper
                .dateFromTimestamp(row.timestamp)
            if (!distinctCheck.has(simpleDate)) {
                dates.push({
                    date: simpleDate,
                    extended_date: extendedDate
                })
                distinctCheck.set(simpleDate, simpleDate)
            }
        }

        return {
            dates, auditoriums, plays
        }

    }

    /**
     * * Получение отфильтрованных броней
     */
    public async getFilteredReservations(userQuery: ReservationFilterQueryInterface, user: UserRequestOption) {
        // Проверка-получение роли
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUser(user.id)
            .catch(e => { throw e })
            
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!userDB) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Пользователь не найден!'
            }
        }

        try {
            // В зависимости от роли выдать либо часть всех броней,
            // либо часть пользовательских броней
            let query: ReservationWithoutSlotsInterface[]
            if (!await this.permissionChecker.check_CanSeeAllReservations(userDB))
                query = await this.reservationModel
                    .getFilteredReservationsForUser(userQuery, user.id)
            else 
                query = await this.reservationModel
                    .getFilteredReservations(userQuery)

            // Отредактировать результирующий список
            const result = await this.reservationInfrastructure
                .fetchReservations(userDB, query)
            
            return result
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при фильтрации броней!'
            }
        }
    }
}