import { User } from '../db/users';

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    User.findByToken(token).then(user => {
        if (!user) return Promise.reject('error from server');

       /* eslint-disable */
        req.user = user; 
        req.token = token;
        /* eslint-enable */
        next();
    }).catch(e => {
        res.status(401).send(e);
    });
};

module.exports = { authenticate };
