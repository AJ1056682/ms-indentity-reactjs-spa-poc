import "../styles/App.css";
import { Form, FormControl } from "react-bootstrap";

export const EmailComponent = (props) => {
    return (
        <>
        <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => {
                props.setEmail(e.target.value);
            }}
        />
        </Form.Group>
    </>
    );
}