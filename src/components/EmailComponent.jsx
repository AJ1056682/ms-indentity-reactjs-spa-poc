import "../styles/App.css";
import { Tabs, Tab, Nav, Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { protectedResources } from "../authConfig";

function handleSumbit(event) {
    event.preventDefault();
}

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
    {/* <pre>{JSON.stringify(roles, null, 2)}</pre> */}
    </>
    );
}