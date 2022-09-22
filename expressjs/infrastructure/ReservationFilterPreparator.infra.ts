import { Auditorium } from "../entities/auditoriums";
import { Play } from "../entities/plays";
import { AuditoriumReservationFilterOption } from "../interfaces/auditoriums";
import { PlayReservationFilterOptionInterface } from "../interfaces/plays";

export interface IReservationFilterPreparator {
    prepareAuditoriumTitle(auditorium: Auditorium): AuditoriumReservationFilterOption
    preparePlayTitle(play: Play): PlayReservationFilterOptionInterface
}

export class ReservationFilterPreparator implements IReservationFilterPreparator {
    public prepareAuditoriumTitle(auditorium: Auditorium) {
        return <AuditoriumReservationFilterOption> {
            title: auditorium.title
        }
    }

    public preparePlayTitle(play: Play) {
        return <PlayReservationFilterOptionInterface> {
            title: play.title
        }
    }
}