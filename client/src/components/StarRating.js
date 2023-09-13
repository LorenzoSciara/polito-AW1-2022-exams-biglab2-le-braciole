import React from "react";
import { FaStar } from "react-icons/fa";
import dayjs from 'dayjs';

const StarRating = (props) => {

    if (dayjs(props.film.watchdate).isValid() === false) {
        return (
            <div>
                {[...Array(5)].map((star, i) => {
                    return (
                        <FaStar key={props.film.title + i} className="star" color={"#e4e5e9"} />
                    );
                })}
            </div>
        );
    }
    else {
        return (
            <div>
                {[...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;
                    return (
                        <label key={props.film.title + i}>
                            <input type="radio" name="rating" value={ratingValue}
                                onClick={() => {

                                    const film =
                                    {
                                        id: props.film.id,
                                        title: props.film.title,
                                        favorite: props.film.favorite,
                                        watchdate: props.film.watchdate,
                                        rating: ratingValue,
                                        user: props.film.user,
                                    }
                                    if (ratingValue !== props.film.rating) {
                                        props.updateFilm(film);
                                        props.setFilms(props.listFilms);
                                    }
                                }}
                            />
                            <FaStar className="star" color={ratingValue <= props.film.rating ? "black" : "#e4e5e9"}
                            />
                        </label>
                    );
                })}
            </div>
        );
    }
};
export default StarRating; 