import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OAuthApp } from './OAuthApp';
import { User } from './User';
import { RefreshToken } from './RefreshToken';

@Entity()
export class OAuthRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => OAuthApp, object => object.requests)
    app!: OAuthApp;

    @ManyToOne(() => User, u => u.requests)
    user!: User;

    @Column({
        type: 'varchar'
    })
    code!: string;

    @Column({
        type: 'varchar'
    })
    scope!: string;

    @Column({
        type: 'datetime'
    })
    expiresAt!: Date;

    @Column({
        type: 'text',
        nullable: true
    })
    codeChallenge!: string;
}
