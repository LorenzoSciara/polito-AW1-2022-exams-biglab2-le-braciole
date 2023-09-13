import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import dayjs from 'dayjs';
import { Container, Table, Row, Col, Button, Navbar, Form, FormControl } from "react-bootstrap";
import { BsCollectionPlay } from "react-icons/bs";
import { FcHighPriority } from "react-icons/fc"
import { FilmForm } from './FilmForm';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React from "react";
import StarRating from './StarRating';
import FavoriteCheck from './favoriteCheck';
import SideBar from './sideBar';
import { useEffect } from 'react';
import { LogoutButton } from './../LoginComponents';

function FilmList(props) {

    const navigate = useNavigate();
    const { filter } = useParams();

    useEffect(() => {
        if (filter === "all" || filter === "favorites" || filter === "bestRated"
            || filter === "seenLastMonth" || filter === "unseen")
            props.setSelectedFilter(filter);

        else if (filter === undefined) {
            navigate("/filter/all");
        }
        else {
            navigate("/filtro-inesistente");
        }
    }, [filter]) 

    return (
        <>
            <Container fluid>
                <Row>
                    <Navbar expand="lg" bg="primary" variant="dark">
                        <Container fluid>
                            <Navbar.Brand>
                                <BsCollectionPlay />{" "} Film Library
                            </Navbar.Brand>
                            <Form className="d-flex">
                                <FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" disabled readOnly/>
                            </Form>
                            <div>
                                <Row><Col>
                                    {props.loggedIn ? <LogoutButton logout={props.doLogOut} user={props.user} /> : false}
                                </Col></Row>
                            </div>
                        </Container>
                    </Navbar>
                </Row>
                <ul></ul>
                <Row>
                    <Col md={3}>
                        <SideBar selectedFilter={props.selectedFilter} setSelectedFilter={props.setSelectedFilter} />
                    </Col>
                    <Col>
                        <FilmListTable listFilms={props.listFilms} selectedFilter={props.selectedFilter} setFilms={props.setFilms}
                            deleteFilm={props.deleteFilm} updateFavorite={props.updateFavorite} updateFilm={props.updateFilm} />
                    </Col>
                </Row>
            </Container >
        </>
    );
}

function FilmListTable(props) {

    const navigate = useNavigate();
    return (
        <Container fluid>
            <Row>
                {props.selectedFilter === "all" ? <h2>Filter: All</h2> : ''}
                {props.selectedFilter === "favorites" ? <h2>Filter: Favorites</h2> : ''}
                {props.selectedFilter === "bestRated" ? <h2>Filter: Best Rated</h2> : ''}
                {props.selectedFilter === "seenLastMonth" ? <h2>Filter: Seen Last Month</h2> : ''}
                {props.selectedFilter === "unseen" ? <h2>Filter: Unseen</h2> : ''}
            </Row>
            <Row>
                <Table>
                    <thead>
                        <tr>
                            <th>Title</th><th>Favorite</th><th>Watchdate</th><th>Rating</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.listFilms.map((film, i) =>
                                <FilmRow listFilms={props.listFilms} key={i} setFilms={props.setFilms} film={film}
                                    selectedFilter={props.selectedFilter} deleteFilm={props.deleteFilm}
                                    updateFavorite={props.updateFavorite} updateFilm={props.updateFilm} />)
                        }
                    </tbody>
                </Table>
                <Col md={{ span: 1, offset: 11 }}>
                    <Button onClick={() => { navigate("/add"); }}
                        className="rounded-circle" > <i className="bi bi-plus-lg"></i></Button>
                </Col>
            </Row>
        </Container>
    );
}

function FilmRow(props) {
    return (
        <tr>
            <FilmData listFilms={props.listFilms} selectedFilter={props.selectedFilter} setFilms={props.setFilms} film={props.film} deleteFilm={props.deleteFilm} updateFavorite={props.updateFavorite} updateFilm={props.updateFilm} />
        </tr>
    );
}

function FilmData(props) {

    const navigate = useNavigate();

    return (
        <>
            {props.film.favorite ? <td className="text-danger">
                <i className="bi bi-film">  </i>
                {props.film.title}
            </td> : <td className="text">
                <i className="bi bi-film">  </i>
                {props.film.title}
            </td>}

            <td>
                <div>
                    <FavoriteCheck listFilms={props.listFilms} setFilms={props.setFilms} film={props.film} updateFavorite={props.updateFavorite} />
                </div>
            </td>

            <td>
                {dayjs(props.film.watchdate).isValid() === false ? 'unseen' : props.film.watchdate.format('YYYY MMMM DD')}
            </td>

            <td>
                <div>
                    <StarRating listFilms={props.listFilms} setFilms={props.setFilms} film={props.film} updateFilm={props.updateFilm} />
                </div>
            </td>

            <td>
                <div>
                    <Button variant='danger' onClick={() => { props.deleteFilm(props.film.id) }}>
                        <i className='bi bi-trash3'></i></Button>

                    <Button className='mx-3' variant='warning' onClick={() => { navigate(`/edit/${props.film.id}`) }} >
                        <i className='bi bi-pencil'></i></Button>
                </div>
            </td>
        </>
    );
}
function NoMatch() {
    return (
        <>
            <h1>
                <p align="center" > Oops! <FcHighPriority /> </p>
                <p align="center">We can't seem to find the page you are looking for. </p>
            </h1>
            <h5 align="center" size="1">Here are some helpful link instead
                <ul></ul>
                <Link to="/">Home</Link>
                <ul></ul>
                <Link to="/filter/favorites">Favorites</Link>
                <ul></ul>
                <Link to="/filter/bestRated">Best Rated</Link>
                <ul></ul>
                <Link to="/filter/seenLastMonth">Seen Last Month</Link>
                <ul></ul>
                <Link to="/filter/unseen">Unseen</Link>

            </h5>

        </>
    );
};
export { FilmList, FilmForm, NoMatch };