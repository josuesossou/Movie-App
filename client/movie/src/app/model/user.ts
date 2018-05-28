export interface User {
    _id?: string;
    username?: string;
}
export interface UserData {
    _id?: string;
    user_id?: string;
    isJoinedRoom?: boolean;
    room_name?: string;
    joinRoomName?: string;
    isRoomCreator: boolean;
    movies: string[];
    socketId: string;
    username?: string;
}
