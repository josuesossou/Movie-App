export interface Room {
    _id?: string;
    creator_name?: string;
    room_name?: string;
    roomNameShort?: string;
    room_size?: number;
    members?: Member[];
}

export interface Member {
    _id?: string;
    memberId?: string;
    memberName?: string;
    status?: boolean;
}
