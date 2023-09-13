import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, ListGroup } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function SideBar(props) {

    const navigate = useNavigate();

    return (
        <Container fluid>
            <ListGroup variant="flush">
                {props.selectedFilter === "all" ? <ListGroup.Item active>All</ListGroup.Item> : <ListGroup.Item action onClick={() => { props.setSelectedFilter("all"); navigate(`/filter/all`) }}>All</ListGroup.Item>}
                {props.selectedFilter === "favorites" ? <ListGroup.Item active>Favorites</ListGroup.Item> : <ListGroup.Item action onClick={() => { props.setSelectedFilter("favorites"); navigate(`/filter/favorites`) }}>Favorites</ListGroup.Item>}
                {props.selectedFilter === "bestRated" ? <ListGroup.Item active>Best Rated</ListGroup.Item> : <ListGroup.Item action onClick={() => { props.setSelectedFilter("bestRated"); navigate(`/filter/bestRated`) }}>Best Rated</ListGroup.Item>}
                {props.selectedFilter === "seenLastMonth" ? <ListGroup.Item active>Seen Last Month</ListGroup.Item> : <ListGroup.Item action onClick={() => { props.setSelectedFilter("seenLastMonth"); navigate(`/filter/seenLastMonth`) }}>Seen Last Month</ListGroup.Item>}
                {props.selectedFilter === "unseen" ? <ListGroup.Item active>Unseen</ListGroup.Item> : <ListGroup.Item action onClick={() => { props.setSelectedFilter("unseen"); navigate(`/filter/unseen`) }}>Unseen</ListGroup.Item>}
            </ListGroup>
        </Container>
    );
}

export default SideBar;