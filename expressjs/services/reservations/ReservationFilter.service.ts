import { IPermissionChecker } from "../../infrastructure/PermissionChecker.infra";
import { IReservationFilterPreparator } from "../../infrastructure/ReservationFilterPreparator.infra";
import { IReservationPreparator } from "../../infrastructure/ReservationPreparator.infra";
import { AuditoriumReservationFilterOption } from "../../interfaces/auditoriums";
import { InnerError } from "../../interfaces/errors";
import { PlayReservationFilterOptionInterface } from "../../interfaces/plays";
import { ReservationFilterQueryInterface, ReservationInterface } from "../../interfaces/reservations";
import { UserRequestOption } from "../../interfaces/users";
import { IReservationRepo } from "../../repositories/Reservation.repo";
import { IUserRepo } from "../../repositories/User.repo";
import { TimestampHelper } from "../../utils/timestamp";

export interface IReservationFilterService {
    getReservationFilterOptions(user: UserRequestOption): Promise<{
        auditoriums: AuditoriumReservationFilterOption[];
        plays: PlayReservationFilterOptionInterface[];
    }>

    getFilteredReservations(userQuery: ReservationFilterQueryInterface, user: UserRequestOption): Promise<ReservationInterface[]>
}

export class ReservationFilterService implements IReservationFilterService {
    protected reservationRepo
    protected userRepo
    protected reservationPreparator
    protected reservationFilterPreparator
    protected timestampHelper
    protected permissionChecker

    constructor(
        reservationRepoInstance: IReservationRepo,
        userRepoInstance: IUserRepo,
        reservationPreparatorInstance: IReservationPreparator,
        reservationFilterPreparatorInstance: IReservationFilterPreparator,
        timestampHelperInstance: TimestampHelper,
        permissionCheckerInstance: IPermissionChecker
    ) {
        this.reservationRepo = reservationRepoInstance
        this.userRepo = userRepoInstance
        this.reservationPreparator = reservationPreparatorInstance
        this.reservationFilterPreparator = reservationFilterPreparatorInstance
        this.timestampHelper = timestampHelperInstance
        this.permissionChecker = permissionCheckerInstance
    }

    /**
     * * Получение значений для фильтра броней
     */
    public async getReservationFilterOptions(user: UserRequestOption) {
        // Проверка-получение роли
        const userDB = await this.userRepo.getUser(user.id)
        if (!userDB) throw new InnerError('Пользователь не распознан.', 403) 
        // Проверка разрешения на просмотр всех броней
        const permissionCheck = await this.permissionChecker.check_CanSeeAllReservations(userDB)
        // Получение названий залов и спектаклей
        const [ auditoriums, plays ] = await Promise.all([
            this.reservationRepo.getAuditoriumsOptionsForReservationFilter(!permissionCheck ? userDB.id : undefined ),
            this.reservationRepo.getPlaysOptionsForReservationFilter(!permissionCheck ? userDB.id : undefined )
        ]) 
        return { 
            auditoriums: auditoriums.map(auditorium => this.reservationFilterPreparator.prepareAuditoriumTitle(auditorium)),
            plays: plays.map(play => this.reservationFilterPreparator.preparePlayTitle(play))
        }
    }

    /**
     * * Получение отфильтрованных броней
     */
    public async getFilteredReservations(userQuery: ReservationFilterQueryInterface, user: UserRequestOption) {
        // Проверка-получение роли
        const userDB = await this.userRepo.getUser(user.id)
        if (!userDB) throw new InnerError('Пользователь не распознан.', 403) 
        // В зависимости от роли выдать либо часть всех броней,
        // либо часть пользовательских броней
        const permissionCheck = await this.permissionChecker.check_CanSeeAllReservations(userDB)
        const query = await this.reservationRepo.getFilteredReservations(userQuery, !permissionCheck ? userDB.id : undefined )
        // Отредактировать результирующий список
        const result: ReservationInterface[] = []
        for (const reservation of query) {
            const fetched = await this.reservationPreparator.prepareReservation(userDB, reservation)
            result.push(fetched)
        }
        return result
    }
}