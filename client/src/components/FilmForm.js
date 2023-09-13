import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Alert, Button, Container, Row, Col } from "react-bootstrap";
import dayjs from 'dayjs';
import React, { useState } from "react";
import { useNavigate, useParams, Navigate } from 'react-router-dom';

function FilmForm(props) {

    const { filmId } = useParams();

    const filmToEdit = props.listFilms.find((f) => f.id === parseInt(filmId));
    const [favorite, setFavorite] = useState(filmToEdit ? filmToEdit.favorite : 0);
    const [title, setTitle] = useState(filmToEdit ? filmToEdit.title : '');
    const [rating, setRating] = useState(filmToEdit ? filmToEdit.rating : 0);
    const [watchdate, setWatchdate] = useState(filmToEdit ? filmToEdit.watchdate : dayjs(null));

    const [errorMsg, setErrorMsg] = useState('');  // stringa vuota '' = non c'e' errore
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        let check = true;

        if (title.trim() == false || title === undefined) {
            setErrorMsg('Errore! Non hai messo il nome del film : ' + title);
            check = false;
        }

        else if (dayjs(watchdate, 'YYYY-MM-DD', true).isValid()) {

            if (watchdate.isAfter(dayjs())) {
                setErrorMsg('Errore! Hai messo una data nel futuro per un film gia visto : ' + watchdate.format('YYYY-MM-DD'));
                check = false;
            }

            if (parseInt(rating) <= 0 || parseInt(rating) > 5 || rating === "") {
                setErrorMsg('Errore! Non hai messo il rating nel range corretto : ' + rating);
                check = false;
            }
        }

        else if (!dayjs(watchdate, 'YYYY-MM-DD', true).isValid() && parseInt(rating) !== 0) {
            setErrorMsg('Errore! Non hai messo il rating a zero per un film non ancora visto : ' + rating);
            check = false;
        }

        else if (!dayjs(watchdate, 'YYYY-MM-DD', true).isValid() && parseInt(favorite) === 1) {
            setErrorMsg('Errore! Hai messo favorite a un film non ancora visto');
            check = false;
        }

        //UPDATE
        if (check && title !== undefined && props.listFilms.find(f => f.id === parseInt(filmId))) {
            const newFilm = {
                id: parseInt(filmId), title: title.trim(), favorite: favorite,
                watchdate: watchdate, rating: dayjs(watchdate, 'YYYY-MM-DD', true).isValid() ? parseInt(rating) : 0,
            };
            props.updateFilm(newFilm);
            navigate(`/filter/${props.selectedFilter}`);
        }

        //ADD
        if (check && title !== undefined && !props.listFilms.find(f => f.id === parseInt(filmId))) {

            const newFilm = {
                title: title.trim(), favorite: favorite, watchdate: watchdate, rating: parseInt(rating),
            };
            props.addFilm(newFilm);
            navigate(`/filter/${props.selectedFilter}`);
        }
    }


    const handleRating = (event) => {
        const val = event.target.value;
        setRating(val);
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        {props.listFilms.map((f) => f.id).includes(parseInt(filmId)) === false && filmId !== undefined ?

                            <Navigate to="/error" /> :
                            <h2>
                                {props.listFilms.map((f) => f.id).includes(parseInt(filmId)) === true ?
                                    "Edit film: " + props.listFilms.find((f) => f.id === parseInt(filmId)).title
                                    : "Form to add new film:"
                                }
                            </h2>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                        <Form>
                            <Form.Group>
                                <Form.Label>Film name</Form.Label>
                                <Form.Control required={true} value={title} onChange={ev => setTitle(ev.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                {
                                    dayjs(watchdate, 'YYYY-MM-DD', true).isValid() ?
                                        <Form.Control type='date' value={watchdate.format('YYYY-MM-DD')} onChange={ev => setWatchdate(dayjs(ev.target.value))} />
                                        :
                                        <Form.Control type='date' value={""} onChange={ev => setWatchdate(dayjs(ev.target.value))} />
                                }
                            </Form.Group>

                            <Form.Group>
                                {favorite ?
                                    <Form.Check type="checkbox" defaultChecked label="Favorite" onClick={() => { setFavorite(0); }} />
                                    : (!favorite && dayjs(watchdate, 'YYYY-MM-DD', true).isValid()) ?
                                        <Form.Check type="checkbox" label="Favorite" onClick={() => { setFavorite(1); }} />
                                        :
                                        <Form.Check type="checkbox" label="Favorite" disabled="disabled" />
                                }
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Rating</Form.Label>
                                {rating ?
                                    <Form.Control type='number' min={1} max={5} value={rating} onChange={ev => handleRating(ev)} />
                                    : (parseInt(rating) === 0 && dayjs(watchdate, 'YYYY-MM-DD', true).isValid()) || rating === '' ?
                                        <Form.Control type='number' min={1} max={5} value={rating} onChange={ev => handleRating(ev)} />
                                        :
                                        <Form.Control type='number' min={1} max={5} value={rating} disabled="disabled" />
                                }
                            </Form.Group>
                            <div>
                                <ul>
                                </ul>
                                <Button variant="secondary" onClick={() => {
                                    navigate(`/filter/${props.selectedFilter}`);
                                }}>Cancel</Button>{" "}

                                <Button type="submit" onClick={handleSubmit}>Save</Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );

}

export { FilmForm };