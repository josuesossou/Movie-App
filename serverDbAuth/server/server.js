import express from 'express';
import { ObjectID } from 'mongodb';
import bodyParser from 'body-parser';
import * as _ from 'lodash';
// import socketIO from 'socket.io';

import { Movie } from './db/movie';
import { ChatRoom } from './db/chat-room';
import { ActiveUsers } from './db/active_users';
import { User } from './db/users';

const app = express();
const port = 3000;

app.use(bodyParser.json());

/************ Movie routes ***************/
app.get('/movies', (req, res) => {
    Movie.find().then(movies => {
        res.send(movies);
    }).catch(e => {
        res.status(400).send(e); 
    });
});

/*************Chat Rooms routes **************/
app.post('/chat-rooms', (req, res) => {
    const chatRoom = new ChatRoom({
        room_name: req.body.room,
        creator_name: req.body.creator_name,
        _creatorID: new ObjectID(),
        room_size: req.body.room_size
    });

    chatRoom.save().then(doc => {
        res.send(doc);
    }).catch(e => {
        res.status(400).send(e);
    });
});
app.get('/chat-rooms', (req, res) => {
    ChatRoom.find().then(rooms => {
        res.send(rooms);
    }).catch(e => {
        res.status(400).send(e);
    });
});
app.patch('/chat-rooms/:id', (req, res) => {
    const body = _.pick(req.body, ['room_size']);
    const id = req.params.id;

    if (!ObjectID.isValid(id)) return res.status(400).send(`Id is not ${id}`);

    ChatRoom.findOneAndUpdate({ _id: id }, { $set: body }, { new: true }).then(room => {
        if (!room) return res.status(400).send(`${id} Id is not valid.`);
        res.send(room);
    }).catch(e => {
        res.status(404).send(e);
    });
});
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
//getting all active/connected users
app.get('/active_users', (req, res) => {
    ActiveUsers.find().then(activeUsers => {
        res.send(activeUsers);
    }).catch(e => {
        res.status(400).send(e);
    });
});
//adding a connected user
app.post('/active_users', (req, res) => {
    const activeUsers = new ActiveUsers({
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        socket_id: req.body.socket_id,
    });
    
    activeUsers.save().then(actives => {
        res.send(actives);
    }).catch(e => {
        res.statust(400).send(e);
    });
});
//removing a disconnected user
app.delete('/active_users', (req, res) => {
    const id = req.body.user_id;

    ActiveUsers.findManyAndRemove({ user_id: id }).then(user => {
        if (!user) return res.status(400).send('User does not exist');

        res.send(user);
    }).catch(e => {
        res.status(400).send(e);
    });
});

/******************* Users authentication Routes **********************/
///register route
app.post('/register', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    if (!req.body.email || !req.body.password) {
        return res.status(404)
                  .send('Provide an email and password');
    }

    user.save().then((userDoc) => {
        user.generateAuthToken().then(token => { 
            res.header('x-auth', token).send(userDoc);
        });
    }).catch(e => {
        res.status(400).send(e);
    });
});

//login user route
app.post('/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    User.findByCredential(body.email, body.password).then(user => {
        user.generateAuthToken()
        .then(token => {
            res.header('x-auth', token).send(user);
        }).catch(e => {
            res.status(400).send(e);
        });
    }).catch(e => {
        res.status(400).send(e.message);
    });
});

app.listen(port, () => {
     console.log(`Server running on port ${port}`);
});
