import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { FilmList } from './components/filmList';
import { useState, useEffect } from 'react';
import { FilmForm, NoMatch } from "./components/filmList";
import { LoginForm } from './LoginComponents';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import API from './API';


function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}

function App2() {

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [listFilms, setFilms] = useState([]); 
  const [dirty, setDirty] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);  // no user is logged in when app loads
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        handleError(err);
      }
    };
    checkAuth();
  }, []);


  useEffect(() => {
    if (loggedIn)
      API.getAllFilms().then((list) => { setFilms(list); setDirty(true); })
        .catch(err => handleError(err))
  }, [loggedIn])


  useEffect(() => {
    if (loggedIn) {
      switch (selectedFilter) {
        case ("all"):
          API.getAllFilms().then((list) => { setFilms(list); setDirty(false);})
            .catch(err => handleError(err))
          break;

        case ("favorites"):
          API.getFilteredFilms("favorites").then((list) => { setFilms(list); setDirty(false);})
            .catch(err => handleError(err))
          break;

        case ("bestRated"):
          API.getFilteredFilms("bestRated").then((list) => { setFilms(list); setDirty(false);})
            .catch(err => handleError(err))
          break;

        case ("seenLastMonth"):
          API.getFilteredFilms("seenLastMonth").then((list) => { setFilms(list); setDirty(false);})
            .catch(err => handleError(err))
          break;

        case ("unseen"):
          API.getFilteredFilms("unseen").then((list) => { setFilms(list); setDirty(false);})
            .catch(err => handleError(err))
          break;

        default:
          API.getAllFilms().then((list) => { setFilms(list); setDirty(false); })
            .catch(err => handleError(err))
          break;
      }
    }
  }, [selectedFilter, dirty, listFilms.length])

  function deleteFilm(id) {
    setFilms(listFilms => listFilms.map(f => (f.id === id) ? { ...f } : f))
    API.deleteFilm(id)
      .then(() => { setDirty(true) })
      .catch(err => handleError(err));
  }

  function addFilm(film) {
    setFilms(oldFilms => [...oldFilms, film]);
    API.addFilm(film)
      .then(() => setDirty(true))
      .catch(err => handleError(err));
  }

  function updateFilm(film) {
    setFilms(listFilms => listFilms.map(
      f => (film.id === f.id) ? Object.assign({}, film) : f
    ));
    API.updateFilm(film)
      .then(() => setDirty(true))
      .catch(err => handleError(err));
  }

  function updateFavorite(id) {
    setFilms(listFilms => listFilms.map(
      f => (f.id === id) ? Object.assign({}, f) : f
    ));
    API.updateFavorite(id)
      .then(() => setDirty(true))
      .catch(err => handleError(err));
  }

  function handleError(err) {
    console.log(err);
  }

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        navigate('/filter/all');
      })
      .catch(err => {
        setMessage(err);
      }
      )
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setFilms([]);
  }
  return (
    <>
  <Container>
        <Row><Col>
          {message ? <Alert variant='danger' onClose={() => setMessage('')} dismissible>{message}</Alert> : false}
        </Col></Row>
  </Container>
      <Routes>
        <Route path='/' element={
          loggedIn ?
            <FilmList listFilms={listFilms} setFilms={setFilms} selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter} deleteFilm={deleteFilm} updateFavorite={updateFavorite} updateFilm={updateFilm}
              loggedIn={loggedIn} doLogOut={doLogOut} user={user} message={message} setMessage={setMessage} />
            : <Navigate to='/login' />
        } />
        <Route path='/login' element={loggedIn ? <Navigate to='/'/> : <LoginForm login={doLogIn} loggedIn={loggedIn} />} />
        <Route path='/filter/:filter' element={
          loggedIn ?
            <FilmList listFilms={listFilms} setFilms={setFilms} selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter} deleteFilm={deleteFilm} updateFavorite={updateFavorite} updateFilm={updateFilm}
              loggedIn={loggedIn} doLogOut={doLogOut} user={user} message={message} setMessage={setMessage} />
            : <Navigate to='/login' />
        } />

        <Route path='/add' element={
          loggedIn ?
            <FilmForm listFilms={listFilms} setFilms={setFilms} selectedFilter={selectedFilter} addFilm={addFilm} />
            : <Navigate to='/login' />
        } />

        <Route path='/edit/:filmId' element={
          loggedIn ?
            <FilmForm listFilms={listFilms} setFilms={setFilms} selectedFilter={selectedFilter} updateFilm={updateFilm} />
            : <Navigate to='/login' />
        } />

      <Route path="*" element={
            <NoMatch />
        } />
      </Routes>

    </>
  );
}

export default App;