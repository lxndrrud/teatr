import { Row } from "../entities/rows";
import { Slot } from "../entities/slots";
import { SlotInterface, SlotIsReservedInterface } from "../interfaces/slots";


export interface ISlotPreparator {
    prepareSlotsForSession(rows: Row[], slots: Slot[], reservedSlots: Slot[]): {
        number: number;
        title: string;
        seats: SlotIsReservedInterface[];
    }[]

    prepareSlotInterface(slot: Slot): SlotInterface
}

export class SlotPreparator implements ISlotPreparator {
    public prepareSlotsForSession(rows: Row[], slots: Slot[], reservedSlots: Slot[]) {
        let result: { 
            id: number,
            number: number,
            title: string,
            seats: SlotIsReservedInterface[] 
        }[] = []
    
        for (let row of rows) {
            const rowSlots = slots.filter((slot) => slot.seat.row.id == row.id)
            const reservedSlotsMap = reservedSlots.map(reservedSlot => reservedSlot.id)
            let slotsList: SlotIsReservedInterface[] = []
            for (let slot of rowSlots) {
                if (reservedSlotsMap.includes(slot.id)) {
                    const item: SlotIsReservedInterface = {
                        id: slot.id,
                        seat_number: slot.seat.number,
                        row_number: slot.seat.row.number,
                        price: slot.price,
                        auditorium_title: slot.seat.row.auditorium.title,
                        row_title: slot.seat.row.title,
                        is_reserved: true
                    }
                    slotsList.push(item)
                }
                else {
                    const item: SlotIsReservedInterface = {
                        id: slot.id,
                        seat_number: slot.seat.number,
                        row_number: slot.seat.row.number,
                        price: slot.price,
                        auditorium_title: slot.seat.row.auditorium.title,
                        row_title: slot.seat.row.title,
                        is_reserved: false
                    }
                    slotsList.push(item)
                }
            }
            result.push({
                id: row.id,
                number: row.number,
                title: row.title,
                seats: slotsList
            })
        }
        result.sort((a: {  id: number, number: number, title: string, seats: SlotIsReservedInterface[] }, 
            b: {  id: number, number: number, title: string, seats: SlotIsReservedInterface[] }) => {
                if (a.id > b.id ) return 1
                else if (a.id < b.id ) return -1
                else return 0
        })
        const resultList: { 
            number: number,
            title: string,
            seats: SlotIsReservedInterface[] 
        }[] = []
        result.forEach(item => {
            resultList.push({
                number: item.number,
                title: item.title,
                seats: item.seats
            })
        })
        return resultList
    }

    prepareSlotInterface(slot: Slot) {
        return <SlotInterface>{
            id: slot.id,
            price: slot.price,
            seat_number: slot.seat.number,
            row_number: slot.seat.row.number,
            row_title: slot.seat.row.title,
            auditorium_title: slot.seat.row.auditorium.title
        }
    }
}