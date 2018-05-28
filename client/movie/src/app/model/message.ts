export interface Message {
    senderName?: string;
    senderId?: string;
    messageText?: string;
    timeStamp?: number;
    roomName?: string;
    joinedRoomName?: string;
    isJoinMessage?: boolean;
    isLeaveMessage?: boolean;
    isToGroup?: boolean;
    class?: string;
    isDisconectMessage?: boolean;
    isConnectedMessage?: boolean;
    newMember?: boolean;
    classTwo?: string;
    isLeave?: boolean;
    socketId?: string;
    movieId?: string;
    recieverId?: string;
}
