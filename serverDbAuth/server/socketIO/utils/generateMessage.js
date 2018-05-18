const generateGroupMessage = (message) => {
    const groupMessage = message;
    groupMessage.class = 'group-message';
    groupMessage.isToGroup = true;

    if (message.isJoinMessage) {
        groupMessage.messageText = `${message.senderName} joined the room`;
    }
    if (message.isLeaveMessage) {
        groupMessage.messageText = `${message.senderName} left the room`;
    }

    return groupMessage;
};

const generateSelfMessage = (message) => {
    const selfMessage = message;
    selfMessage.class = 'self-message';
    selfMessage.isToGroup = false;

    if (message.isJoinMessage) {
        selfMessage.messageText = `Welcome to ${message.roomName}`;
    }

    return selfMessage;
};

module.exports = { generateGroupMessage, generateSelfMessage };
