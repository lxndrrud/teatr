import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { Session } from './sessions'
import { Slot } from './slots'

@Entity({ name: 'price_policies' })
export class PricePolicy {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @OneToMany(() => Slot, slot => slot.pricePolicy)
    slots!: Slot[]
    
    @OneToMany(() => Session, session => session.pricePolicy)
    sessions!: Session[]
}