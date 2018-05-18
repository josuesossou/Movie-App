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
}
