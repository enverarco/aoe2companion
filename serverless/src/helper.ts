import {createDB} from "./handler";
import {KeyValue} from "../entity/keyvalue";
import fetch from "node-fetch";
import {IMatch, IPlayer} from "../entity/entity.type";

export async function setValue(id: string, value: any) {
    const connection = await createDB();

    const keyValue = new KeyValue();
    keyValue.id = id;
    keyValue.value = JSON.stringify(value);

    const query = connection.createQueryBuilder()
        .insert()
        .into(KeyValue)
        .values([keyValue])
        .orUpdate({conflict_target: ['id'], overwrite: ['value']});

    await query.execute();
}

export async function getValue(id: string) {
    const connection = await createDB();
    const keyValue = await connection.manager.findOne(KeyValue, id);
    return JSON.parse(keyValue?.value ?? null);
}



export interface IParams {
    [key: string]: any;
}

export function makeQueryString(params: IParams) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

export interface IFetchLeaderboardParams {
    start?: number;
    count: number;
    search?: string;
    steam_id?: string;
    profile_id?: number;
}


export interface ILeaderboardPlayerRaw {
    clan: string;
    country: string;
    drops: number;
    games: number;
    highest_rating: number;
    highest_streak: number;
    icon: any;
    last_match: any;
    last_match_time: any;
    losses: number;
    lowest_streak: number;
    name: string;
    previous_rating: number;
    profile_id: number;
    rank: number;
    rating: number;
    steam_id: string;
    streak: number;
    wins: number;
}


export interface IMatchRaw {
    match_id: string;
    match_uuid: string;
    lobby_id: any;
    name: string;
    opened?: any;
    started?: any;
    finished?: any;
    leaderboard_id: number;
    num_slots: number;
    has_password: boolean;
    server: string;
    map_type: number;
    average_rating: any;
    cheats: boolean;
    ending_age: number;
    expansion: any;
    full_tech_tree: boolean;
    game_type: any;
    has_custom_content: any;
    lock_speed: boolean;
    lock_teams: boolean;
    map_size: number;
    num_players: number;
    players: IPlayer[];
    pop: number;
    ranked: boolean;
    rating_type: any;
    resources: any;
    rms: any;
    scenario: any;
    shared_exploration: boolean;
    speed: number;
    starting_age: number;
    team_positions: boolean;
    team_together: boolean;
    treaty_length: any;
    turbo: boolean;
    version: string;
    victory: any;
    victory_time: any;
    visibility: any;
}


export async function fetchLeaderboard(game: string, leaderboard_id: number, params: IFetchLeaderboardParams) {
    const queryString = makeQueryString({
        game,
        leaderboard_id,
        ...params,
    });

    const url = `http://aoe2.net/api/leaderboard?${queryString}`;
    const response = await fetch(url);
    try {
        return await response.json();
    } catch (e) {
        console.log("FAILED", url);
        throw e;
    }
}

export async function fetchMatches(game: string, start: number, count: number, since?: number): Promise<IMatchRaw[]> {
    const queryString = makeQueryString({
        game,
        start,
        count,
        since,
    });

    const url = `http://aoe2.net/api/matches?${queryString}`;
    console.log(url);
    const response = await fetch(url);
    try {
        return await response.json();
    } catch (e) {
        console.log("FAILED", url);
        throw e;
    }
}
