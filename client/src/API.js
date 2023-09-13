/**
 * All the API calls
 */

const dayjs = require("dayjs");
const URL = 'http://localhost:3001/api'

async function getAllFilms() {
  // call  /api/films
  const response = await fetch(URL + '/films', { credentials: 'include' });
  const filmsJson = await response.json();
  if (response.ok) {
    return filmsJson.map((f) => ({ id: f.id, title: f.title, favorite: f.favorite, watchdate: dayjs(f.watchdate), rating: f.rating === null ? 0 : f.rating }))
  } else {
    throw filmsJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getFilteredFilms(filter) {
  // call  /api/films/filter/:filter
  const response = await fetch(URL + '/films/filter/' + filter, { credentials: 'include' });
  const filmsJson = await response.json();
  if (response.ok) {
    return filmsJson.map((f) => ({ id: f.id, title: f.title, favorite: f.favorite, watchdate: dayjs(f.watchdate), rating: f.rating === null ? 0 : f.rating }))
  } else {
    throw filmsJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getFilmById(id) {
  // call  /api/films/:id
  const response = await fetch(URL + '/films/' + id, { credentials: 'include' });
  const filmsJson = await response.json();
  if (response.ok) {

    return filmsJson.map((f) => ({ id: f.id, title: f.title, favorite: f.favorite, watchdate: dayjs(f.watchdate), rating: f.rating === null ? 0 : f.rating, user: f.user }))
  } else {
    throw filmsJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

function updateFilm(film) {
  // call PUT /api/films/:id
  return new Promise((resolve, reject) => {
    fetch(URL + '/films/' + film.id, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: film.id, title: film.title, favorite: film.favorite,
        watchdate: dayjs(film.watchdate).format("YYYY-MM-DD"),
        rating: film.rating, user: film.user
      }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}


function updateFavorite(film) {
  // call PUT /api/films/:id/favorite
  return new Promise((resolve, reject) => {
    fetch(URL + '/films/' + film.id + '/favorite', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: film.id, title: film.title, favorite: film.favorite,
        watchdate: dayjs(film.watchdate).format("YYYY-MM-DD"),
        rating: film.rating, user: film.user
      }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function deleteFilm(id) {
  // call: DELETE /api/films/:id

  return new Promise((resolve, reject) => {
    fetch(URL + '/films/' + id, {
      method: 'DELETE',
      credentials: 'include',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function addFilm(film) {
  // call: POST /api/films
  return new Promise((resolve, reject) => {
    fetch(URL + '/films', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: film.id, title: film.title, favorite: film.favorite,
        watchdate: dayjs(film.watchdate).format("YYYY-MM-DD"),
        rating: film.rating === null ? 0 : film.rating, user: film.user
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

async function logIn(credentials) {
  let response = await fetch(URL + '/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL + '/sessions/current', { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
  const response = await fetch(URL + '/sessions/current', { credentials: 'include' });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}


const API = { getAllFilms, getFilteredFilms, getFilmById, updateFavorite, updateFilm, deleteFilm, addFilm, logIn, logOut, getUserInfo };
export default API;