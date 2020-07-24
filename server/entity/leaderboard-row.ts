import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class LeaderboardRow {
    @PrimaryColumn()
    leaderboardId: number;

    @PrimaryColumn()
    rank: number;

    @Column()
    profileId: number;

    @Column({ nullable: true })
    steamId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    country?: string;

    @Column('jsonb')
    data: any;

    @Column({ nullable: true })
    clan?: string;

    @Column({ nullable: true })
    icon?: string;

    @Column({ nullable: true })
    wins?: number;

    @Column({ nullable: true })
    drops?: number;

    @Column({ nullable: true })
    games?: number;

    @Column({ nullable: true })
    losses?: number;

    @Column({ nullable: true })
    rating?: number;

    @Column({ nullable: true })
    streak?: number;

    @Column({ nullable: true })
    last_match?: number;

    @Column({ nullable: true })
    lowest_streak?: number;

    @Column({ nullable: true })
    highest_rating?: number;

    @Column({ nullable: true })
    highest_streak?: number;

    @Column({ nullable: true })
    last_match_time?: number;

    @Column({ nullable: true })
    previous_rating?: number;
}
