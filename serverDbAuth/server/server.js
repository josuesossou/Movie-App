import cors from 'cors';
import { ObjectID } from 'mongodb';
import bodyParser from 'body-parser';
import * as _ from 'lodash';
import { app, server } from './config/server-config';

//db imports
import { Category } from './db/categories';
import { Movie } from './db/movie';
import { ChatRoom } from './db/chat-room';
import { UsersData } from './db/users_data';
import { User } from './db/users';

//lib imports
import { getChatRoom, updateChatRoom } from './lib/chat-room';

/*** MIDDLEWARE imports ****/
import { authenticate } from './middleware/authenticate';
/* eslint-disable no-underscore-dangle, no-unused-vars*/
import { io } from './socketIO/socketIO';
/* eslint-enable no-unused-vars*/

const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
     'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Expose-Headers', 'x-auth');
    next();
});

app.use(cors());
app.use(bodyParser.json());
/************ Categories *****************/
app.get('/categories', (req, res) => {
    Category.find().then(movies => {
        res.send(movies);
    }).catch(e => {
        res.status(400).send(e); 
    });
});

/************ Movie routes ***************/
app.get('/movies', (req, res) => {
    Movie.find().then(movies => {
        res.send(movies);
    }).catch(e => {
        res.status(400).send(e); 
    });
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;

    Movie.findById(id).then(movies => {
        res.send(movies);
    }).catch(e => {
        res.status(400).send(e); 
    });
});

app.post('/querymovies', (req, res) => {
    const body = _.pick(req.body, ['category']);

    Movie.find({ category: body.category }).then(movies => {
        res.send(movies);
    }).catch(e => {
        res.status(400).send(e); 
    });
});

app.post('/movies', (req, res) => {
    const body = _.pick(req.body, ['url_video', 'url_thumbnail', 'title', 'price', 'category']);
    const movie = new Movie(body);

    movie.save().then(movies => {
        res.send(movies);
    }).catch(e => {
        res.status(400).send(e); 
    });
});
/*************Chat Rooms routes **************/
//creating a chat room
app.post('/chat-rooms', authenticate, (req, res) => {
    const body = _.pick(req.body, ['room_name']);
    body.creator_name = req.user.username;
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
//updaing a chat room members
app.patch('/chat-rooms/:id', async (req, res) => {
    const body = _.pick(req.body, ['member']);
    const id = req.params.id;

    if (!ObjectID.isValid(id)) return res.status(400).send(`${id} is not valid.`);

    const room = await getChatRoom(id);

    room.members.push(body.member);
    room.room_size = room.members.length;

    updateChatRoom(id, room).then(doc => {
        if (!doc) return res.status(400).send(`${id} Id is not valid.`);
        res.send(doc);
    }).catch(e => {
        res.status(404).send(e);
    });
});

// updating a chat room member status
app.patch('/chat-room-status/:id', async (req, res) => {
    const body = _.pick(req.body, ['memberId', 'status']);
    const id = req.params.id;

    if (!ObjectID.isValid(id)) return res.status(400).send(`${id} is not valid.`);

    const room = await getChatRoom(id);

    room.members = room.members.map(member => {
        if (member.memberId === body.memberId) {
            const updatedMember = member;
            updatedMember.status = body.status;
            return updatedMember;
        }
        return member;
    });

    updateChatRoom(id, room).then(doc => {
        if (!doc) return res.status(400).send(`${id} Id is not valid.`);
        res.send(doc);
    }).catch(e => {
        res.status(404).send(e);
    });
});

//deleting a chat room
app.delete('/chat-rooms/:id', async (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['memberId']);

    if (!ObjectID.isValid(id)) return res.status(400).send(`${id} is not valid.`);

    const room = await getChatRoom(id);

    room.members = room.members.filter(member => member.memberId !== body.memberId);
    room.room_size = room.members.length;

    updateChatRoom(id, room).then(doc => {
        if (!doc) return res.status(400).send(`${id} Id is not valid.`);
        res.send(doc);
    }).catch(e => {
        res.status(404).send(e);
    });
});

/************* Connected users collections *****************/
//getting all users data, to find on/off users
app.get('/users-data', (req, res) => {
    UsersData.find().then(users => {
        const usersObject = users.map(room => {
            const userObject = room.toObject();
            return _.pick(userObject, ['user_id', 'socketId', 'username']);
        });
        res.send(usersObject);
    }).catch(e => {
        res.status(400).send(e);
    });
});
//getting a single user
app.get('/users-data/:id', authenticate, (req, res) => {
    const id = req.params.id; 

    UsersData.findOne({ user_id: id }).then(userData => {
        if (!userData) return res.status(404).send('unable to find userData');
        res.send(userData);
    }).catch(e => {
        res.status(400).send(e);
    });
});
//adding a user's data
app.post('/users-data', authenticate, (req, res) => {
    const body = _.pick(req.body, []);
    body.user_id = req.user._id;
    body.username = req.user.username;
    body.status = true;

    const usersData = new UsersData(body);
    
    usersData.save().then(data => {
        res.send(data);
    }).catch(e => {
        res.status(400).send(e);
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
        'socketId',
        'status',
    ]);

    UsersData.findOneAndUpdate({ user_id: req.user._id },
        { $set: body }, { new: true }).then(user => {
        if (!user) return res.status(404).send('Unable to update');
        res.send(user);
    }).catch(() => {
        res.status(400).send('Error while updating');
    });
});

/******************* Users authentication Routes *******************/
///register route
app.post('/register', (req, res) => {
    const body = _.pick(req.body, ['username', 'password']);
    const user = new User(body);

    if (!req.body.username || !req.body.password) {
        return res.status(404)
                .send('Provide a username and password');
    }

    user.save().then(() => user.generateAuthToken())
    .then(token => { 
        res.header('x-auth', token).send(user);
    }).catch(e => {
        if (e.code === 11000) return res.status(400).send('Username already taken');
        res.status(400).send('Unable to register');
    });
});

app.post('/reset-password', (req, res) => {
    const body = _.pick(req.body, ['username', 'password']);
    const user = new User(body);

    if (!req.body.username || !req.body.password) {
        return res.status(404)
                .send('Provide a username and password');
    }

    User.findOneAndRemove({ username: body.username }).then(() => {
        user.save().then(() => user.generateAuthToken())
        .then(token => { 
            res.header('x-auth', token).send(user);
        }).catch(e => {
            res.status(400).send(e);
        });
    });
});

//login user route
app.post('/login', (req, res) => {
    const body = _.pick(req.body, ['username', 'password']);

    User.findByCredential(body.username, body.password).then(async (user) => {
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);     
    }).catch(e => {
        res.status(400).send(e);
    });
});

//logout user by removing token
app.delete('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then((() => {
        res.status(200).send('successfully Logged out');
    })).catch(e => {
        res.status(400).send(e);
    });
});

//get user data
app.get('/user', authenticate, (req, res) => {
    res.send(req.user);
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
