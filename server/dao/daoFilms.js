'use strict';
const dayjs = require('dayjs');

/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if (err) throw err;
});

// get all films
exports.listFilms = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE user = ?';
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const films = rows.map((f) => ({
        id: f.id, title: f.title, favorite: f.favorite, watchdate: new dayjs(f.watchdate), rating: f.rating, user: f.user
      }));
      resolve(films);
    });
  });
};

// get the film identified by {id}
exports.getFilmById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row === undefined) {
        resolve({ error: 'Film not found.' });
      } else {
        const film = { id: row.id, title: row.title, favorite: row.favorite, watchdate: new dayjs(row.watchdate), rating: row.rating, user: row.user };
        resolve(film);
      }
    });
  });
};
exports.getFilmByFilter = (filter, userId) => {
  return new Promise((resolve, reject) => {
    if (filter === "all") {
      const sql = 'SELECT * FROM films WHERE user= ?';
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const films = rows.map((f) => ({
          id: f.id, title: f.title, favorite: f.favorite, watchdate: new dayjs(f.watchdate), rating: f.rating, user: f.user
        }));
        resolve(films);
      });
    }
    else if (filter === "favorites") {
      const sql = 'SELECT * FROM films WHERE favorite = ? AND user = ?';
      let param = 1;
      db.all(sql, [param, userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const films = rows.map((f) => ({
          id: f.id, title: f.title, favorite: f.favorite, watchdate: new dayjs(f.watchdate), rating: f.rating, user: f.user
        }));
        resolve(films);
      });
    }
    else if (filter === "bestRated") {
      const sql = 'SELECT * FROM films WHERE rating = ? AND user = ?';
      let param = 5;
      db.all(sql, [param, userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const films = rows.map((f) => ({
          id: f.id, title: f.title, favorite: f.favorite, watchdate: new dayjs(f.watchdate), rating: f.rating, user: f.user
        }));
        resolve(films);
      });
    }
    else if (filter === "seenLastMonth") {

      const sql = 'SELECT * FROM films WHERE (julianday(?) - julianday(watchdate)) < ? AND watchdate IS NOT NULL AND user = ?';
      let param = "now";
      let param2 = 30;

      db.all(sql, [param, param2, userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const films = rows.map((f) => ({
          id: f.id, title: f.title, favorite: f.favorite, watchdate: new dayjs(f.watchdate), rating: f.rating, user: f.user
        }));
        resolve(films);
      });
    }
    else if (filter === "unseen") {
      const sql = 'SELECT * FROM films WHERE watchdate IS NULL AND user = ?';
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const films = rows.map((f) => ({
          id: f.id, title: f.title, favorite: f.favorite, watchdate: new dayjs(f.watchdate), rating: f.rating, user: f.user
        }));
        resolve(films);
      });
    }
  });
};

// add a new film
exports.createFilm = (film, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO films(title, favorite, watchdate, rating, user) VALUES(?, ?, DATE(?), ?, ?)';
    db.run(sql, [film.title, film.favorite, film.watchdate, film.rating, userId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// update an existing film
exports.updateFilm = (film, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET title=?, favorite=?, watchdate=DATE(?), rating=?, user=? WHERE id = ?';
    db.run(sql, [film.title, film.favorite, film.watchdate, film.rating, userId, film.id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// mark favorite an existing film
exports.updateFavoriteFilm = (film, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET favorite = ? WHERE id = ? AND user = ?';
    db.run(sql, [film.favorite, film.id, userId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};


// delete an existing film
exports.deleteFilm = (id, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM films WHERE id = ? AND user = ?';
    db.run(sql, [id, userId], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}