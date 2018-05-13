export interface Message {
    senderName?:string,
    messageText?:string,
    timeStamp?:string,
    roomName?:string
}

export interface UserData {
    _id?:string,
    user?:string,
    messageText?:string,
    timeStamp?:string,
    roomName?:string,
    creator
}