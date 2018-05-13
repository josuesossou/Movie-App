import cors from 'cors';
import { ObjectID } from 'mongodb';
import bodyParser from 'body-parser';
import * as _ from 'lodash';
import { app } from './config/server-config';

//db imports
import { Movie } from './db/movie';
import { ChatRoom } from './db/chat-room';
import { UsersData } from './db/users_data';
import { User } from './db/users';

//lib imports
import { getChatRoom } from './lib/chat-room';

/*** MIDDLEWARE imports ****/
import { authenticate } from './middleware/authenticate';

import { io } from './socketIO/socketIO';


io.listen(3001);
const port = 3000;

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });
app.use(cors());
app.use(bodyParser.json());
/* eslint-disable no-underscore-dangle*/
/************ Movie routes ***************/
app.get('/movies', (req, res) => {
    Movie.find().then(movies => {
        res.send(movies);
    }).catch(e => {
        res.status(400).send(e); 
    });
});

/*************Chat Rooms routes **************/
//creating a chat room
app.post('/chat-rooms', authenticate, (req, res) => {
    const body = _.pick(req.body, ['room_name']);
    body.creator_name = req.user.user_name;
    body.members = [];

    const chatRoom = new ChatRoom(body);

    chatRoom.save().then(doc => {
        res.send(doc);
    }).catch(e => {
        res.status(400).send(e);
    });
});
//getting all chat rooms
app.get('/chat-rooms', (req, res) => {
    ChatRoom.find().then(rooms => {
        const roomObjects = rooms.map(room => {
            const roomObject = room.toObject();
            return _.pick(roomObject, ['_id', 'room_name', 'room_size', 'creator_name']);
        });
        res.send(roomObjects);
    }).catch(e => {
        res.status(400).send(e);
    });
});
//get one chat room data 
app.get('/chat-rooms/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    const room = await getChatRoom(id);
    if (!room) return res.send('no room');

    res.send(room);
});
//updaing a chat room
app.patch('/chat-rooms/:id', async (req, res) => {
    const body = _.pick(req.body, ['member']);
    const id = req.params.id;

    if (!ObjectID.isValid(id)) return res.status(400).send(`Id is not ${id}`);

    const room = await getChatRoom(id);
    console.log(room.members);
    room.members.push(body.member);
    room.room_size = room.members.length;

    ChatRoom.findOneAndUpdate({ _id: id }, { $set: room }, { new: true }).then(doc => {
        if (!doc) return res.status(400).send(`${id} Id is not valid.`);
        res.send(doc);
    }).catch(e => {
        res.status(404).send(e);
    });
});
//deleting a chat room
app.delete('/chat-rooms/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) return res.status(400).send(`Id is not ${id}`);

    ChatRoom.findOneAndRemove({ _id: id }).then(room => {
        if (!room) return res.status(400).send(`${id} Id is not valid.`);

        res.send(room);
    }).catch(e => {
        res.status(404).send(e);
    });
});

/************* Connected users collections *****************/
//getting all users data, to find on/off users
app.get('/users-data', (req, res) => {
    UsersData.find().then(activeUsers => {
        res.send(activeUsers);
    }).catch(e => {
        res.status(400).send(e);
    });
});
//getting a single user
app.get('/users-data/user', authenticate, (req, res) => {
    UsersData.find().then(userData => {
        res.send(userData);
    }).catch(e => {
        res.status(400).send(e);
    });
});
//adding a user's data
app.post('/users-data', authenticate, (req, res) => {
    console.log(req.body);
    const body = _.pick(req.body, []);
    body.user_id = req.user._id;

    const usersData = new UsersData(body);
    
    usersData.save().then(data => {
        res.send(data);
    }).catch(e => {
        res.statust(400).send(e);
    });
});
//updating a user's data
    /*
    note: user_id for user data corresponds to the authenticated user's 
    _id property
    */
app.patch('/users-data/user', authenticate, (req, res) => {
    const body = _.pick(req.body, [
        'isJoinedRoom',
        'room_name',
        'joinRoomName',
        'isRoomCreator',
        'movies',
        'movie_room',
        'socket_id'
    ]);

    UsersData.findOneAndUpdate({ user_id: req.user._id },
        { $set: body }, { new: true }).then(user => {
        if (!user) return res.status(404).send('Unable to update');
        res.send(user);
    }).catch(() => {
        res.status(400).send('Error while updating');
    });
});

//removing a disconnected user
// app.delete('/users-data', (req, res) => {
//     const id = req.body.user_id;

//     UsersData.findManyAndRemove({ user_id: id }).then(user => {
//         if (!user) return res.status(400).send('User does not exist');

//         res.send(user);
//     }).catch(e => {
//         res.status(400).send(e);
//     });
// });

/******************* Users authentication Routes *******************/
///register route
app.post('/register', (req, res) => {
    const body = _.pick(req.body, ['user_name', 'password']);
    const user = new User(body);

    if (!req.body.user_name || !req.body.password) {
        return res.status(404)
                .send('Provide an user name and password');
    }

    user.save().then(() => user.generateAuthToken())
    .then(token => { 
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send(e);
    });
});

//login user route
app.post('/login', (req, res) => {
    const body = _.pick(req.body, ['user_name', 'password']);
    User.findByCredential(body.user_name, body.password).then(async (user) => {
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);     
    }).catch(e => {
        res.status(400).send(e.message);
    });
});

//logout user by removing token
app.delete('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then((() => {
        res.status(200).send('successfully Logged out');
    })).catch(e => {
        res.status(400).send(e.message);
    });
});

//get user data
app.get('/user', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
