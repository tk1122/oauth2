import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OAuthRequest } from './OAuthRequest';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar'
    })
    jti!: string;

    @OneToOne(() => OAuthRequest)
    @JoinColumn()
    request!: OAuthRequest;
}
