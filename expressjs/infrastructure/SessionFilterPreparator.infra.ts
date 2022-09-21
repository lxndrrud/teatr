import { Auditorium } from "../entities/auditoriums";
import { Play } from "../entities/plays";
import { AuditoriumSessionFilterOption } from '../interfaces/auditoriums'
import { PlaySessionFilterOptionInterface } from "../interfaces/plays";

export interface ISessionFilterPreparator {
    prepareAuditoriumTitles(auditoriums: Auditorium[]): AuditoriumSessionFilterOption[]
    preparePlayTitles(plays: Play[]): PlaySessionFilterOptionInterface[]
}

export class SessionFilterPreparator implements ISessionFilterPreparator {
    public prepareAuditoriumTitles(auditoriums: Auditorium[]) {
        const resultList: AuditoriumSessionFilterOption[]  = []
        for( let auditorium of auditoriums) {
            resultList.push(<AuditoriumSessionFilterOption> {
                title: auditorium.title
            })
        }
        return resultList
    }

    public preparePlayTitles(plays: Play[]) {
        const resultList: PlaySessionFilterOptionInterface[]  = []
        for( let play of plays) {
            resultList.push(<PlaySessionFilterOptionInterface> {
                title: play.title
            })
        }
        return resultList
    }
}