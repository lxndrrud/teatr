import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Record {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
        default: 'Не указаноs'
    })
    firstname: string;

    @Column({
        nullable: true,
        default: 'Не указаноs'
    })
    middlename: string;

    @Column({
        nullable: true,
        default: 'Не указаноs'
    })
    lastname: string;

    @Column({
        nullable: false
    })
    email: string;

}