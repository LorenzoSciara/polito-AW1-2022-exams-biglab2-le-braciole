import React from "react";
import dayjs from 'dayjs';
import { Form } from "react-bootstrap";

const FavoriteCheck = (props) => {    
    if (dayjs(props.film.watchdate).isValid() === false) {
        return (
            <label key={props.film.id}>
                <Form.Group name="ind" className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" disabled="disabled" label="Favorite" />
                </Form.Group>
            </label>
        );
    }

    else if (props.film.favorite === 1) {
        return (
            <label key={props.film.title}>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Favorite" defaultChecked
                        onClick={() => {
                            props.updateFavorite(props.film)
                        }}
                    />
                </Form.Group>
            </label>
        );
    }

    else if (props.film.favorite === 0) {
        return (
            <label key={props.film.id}>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Favorite"
                        onClick={() => {
                            props.updateFavorite(props.film)
                        }}
                    />
                </Form.Group>
            </label>
        );
    }
};
export default FavoriteCheck; 