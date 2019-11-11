import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OAuthRequest } from './OAuthRequest';
import { User } from './User';

@Entity()
export class OAuthApp {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar'
    })
    name!: string;

    @Column({
        type: 'varchar'
    })
    redirectUri!: string;

    @Column({
        type: 'varchar'
    })
    clientId!: string;

    @Column({
        type: 'varchar'
    })
    clientSecret!: string;

    @Column({
        type: 'varchar'
    })
    scope!: string;

    @OneToMany(() => OAuthRequest, object => object.app)
    requests!: OAuthRequest[];

    @ManyToOne(() => User, u => u.apps)
    user!: User;
}
