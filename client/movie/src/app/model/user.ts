export interface User {
    id?: string;
    user_name?: string;
}
export interface UserData {
    _id?: string;
    user_id?: string;
    isJoinedRoom?: boolean;
    room_name?: string;
    joinRoomName?: string;
    isRoomCreator: boolean;
    movies: string[];
}
