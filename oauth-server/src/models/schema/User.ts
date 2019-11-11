import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OAuthRequest } from './OAuthRequest';
import { OAuthApp } from './OAuthApp';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar'
    })
    username!: string;

    @Column({
        type: 'varchar'
    })
    password!: string;

    @Column({
        type: 'varchar'
    })
    name!: string;

    @Column({
        type: 'int'
    })
    age!: number;

    @Column({
        type: 'varchar'
    })
    email!: string;

    @Column({
        type: 'varchar'
    })
    creditCard!: string;

    @Column({
        type: 'varchar'
    })
    identityNumber!: string;

    @OneToMany(() => OAuthRequest, or => or.user)
    requests!: OAuthRequest[];

    @OneToMany(() => OAuthApp, oa => oa.user)
    apps!: OAuthApp[];
}
