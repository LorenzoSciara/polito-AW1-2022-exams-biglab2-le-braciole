'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dao = require('./dao/daoFilms'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const session = require('express-session'); // enable sessions
const userDao = require('./dao/daoUser'); // module for accessing the users in the DB
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const cors = require('cors');
const dayjs = require('dayjs');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));
// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

const PORT = 3001;
const app = express();

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));
// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

// GET /api/films
app.get('/api/films', isLoggedIn, (req, res) => {
    dao.listFilms(req.user.id)
        .then(films => res.json(films))
        .catch(() => res.status(500).end());
});

// GET BY FILTER/api/films/:filter
app.get('/api/films/filter/:filter', isLoggedIn, async (req, res) => {
    try {
        const result = await dao.getFilmByFilter(req.params.filter, req.user.id);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
});

// GET BY ID /api/films/:id
app.get('/api/films/:id', isLoggedIn, async (req, res) => {
    try {
        const result = await dao.getFilmById(req.params.id);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
});

// POST /api/films
app.post('/api/films', isLoggedIn, [
    check('title').isLength({ min: 1, max: 100 }),
    check('favorite').isInt({ min: 0, max: 1 }),
    check('rating').isInt({ min: 0, max: 5 }),
    check('watchdate').not().isDate({ format: 'YYYY MMMM DD', strictMode: true })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const film = {
        title: req.body.title,
        favorite: req.body.favorite,
        watchdate: req.body.watchdate,
        rating: req.body.rating,
        user: req.body.user
    };
    try {
        await dao.createFilm(film, req.user.id);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the creation of film ${film.id}.` });
    }
});

// PUT UPDATE A FILM /api/films/:id
app.put('/api/films/:id', isLoggedIn, [
    check('title').isLength({ min: 1, max: 100 }).withMessage('La lunghezza del nome deve essere compresa tra 1 e 100'),
    check('favorite').isInt({ min: 0, max: 1 }).withMessage('Favorite può essere soltanto 1 o 0'),
    check('rating').isInt({ min: 0, max: 5 }).withMessage('Il rating deve essere un valore tra 0 e 5'),
    check('watchdate').not().isDate({ format: 'YYYY MMMM DD', strictMode: true })
    /* check('watchdate').custom((date) => {
        if (dayjs(date).format("YYYY-MMMM-DD").isInvalid() || dayjs(date).format("YYYY-MMMM-DD").isBefore(dayjs("")))
            throw new Error('Formato data non valido');
    }) */
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const film =
    {
        id: req.params.id,
        title: req.body.title,
        favorite: req.body.favorite,
        watchdate: req.body.watchdate,
        rating: req.body.rating,
        user: req.body.user
    }
    try {
        await dao.updateFilm(film, req.user.id);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of film ${req.params.id}.` });
    }
});

// PUT MARK FAVORITE /api/films/:id/favorite
app.put('/api/films/:id/favorite', isLoggedIn, [
    check('title').isLength({ min: 1, max: 100 }).withMessage('La lunghezza del nome deve essere compresa tra 1 e 100'),
    check('favorite').isInt({ min: 0, max: 1 }).withMessage('Favorite può essere soltanto 1 o 0'),
    check('rating').isInt({ min: 0, max: 5 }).withMessage('Il rating deve essere un valore tra 0 e 5'),
    check('watchdate').not().isDate({ format: 'YYYY MMMM DD', strictMode: true })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const film =
    {
        id: req.params.id,
        title: req.body.title,
        favorite: !req.body.favorite,
        watchdate: req.body.watchdate,
        rating: req.body.rating,
        user: req.body.user
    }
    try {
        await dao.updateFavoriteFilm(film, req.user.id);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of film ${req.params.id}.` });
    }
});

// DELETE /api/films/:id
app.delete('/api/films/:id', isLoggedIn, async (req, res) => {

    const result = await dao.getFilmById(req.params.id, req.user.id);
    if (result.error)
        res.status(404).json(result);
    else {
        try {
            await dao.deleteFilm(req.params.id, req.user.id);
            res.status(204).end();
        } catch (err) {
            res.status(503).json({ error: `Database error during the deletion of film ${req.params.id}.` });
        }
    }
});

/*** Users APIs ***/
// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => { res.end(); });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });;
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));