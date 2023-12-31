import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { IoLogOutOutline } from "react-icons/io5";

function LoginForm(props) {
    const [username, setUsername] = useState('testuser@polito.it');
    const [password, setPassword] = useState('password');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };

        let valid = true;
        if (username === '' || password === '')
            valid = false;

        if (valid) {
            props.login(credentials);
        }
        else {
            setErrorMessage('Error(s) in the form, please fix it.')
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Login</h2>
                    <Form>
                        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                        <Form.Group controlId='username'>
                            <Form.Label>email</Form.Label>
                            <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value.trim())} />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                        </Form.Group>
                        <ul></ul>
                        <Button onClick={handleSubmit}>Login</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

function LogoutButton(props) {
    return (
        <Col>
            <span className="text-white">Welcome, {props.user?.name}</span>{' '}
            <Button onClick={props.logout} variant='danger'> <IoLogOutOutline size={30} color={"#e4e5e9"} />{" "} Logout</Button>
        </Col>
    )
}

export { LoginForm, LogoutButton };