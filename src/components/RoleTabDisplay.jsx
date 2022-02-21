import "../styles/App.css";
import { Form } from "react-bootstrap";

function handleSumbit(event) {
    event.preventDefault();
}

export const AddRole = (props) => {
    const roles = props.roles;
    const selectedRole = props.selectedRole;
    const setSelectedRole = props.setSelectedRole;
    return (
        <>
            {roles ? (
                <Form onSubmit={handleSumbit}>
                    <Form.Group controlId="roles">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            as="select"
                            defaultValue={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                            }}
                        >
                            {roles.map((role, index) => (
                                <option key={index}>{role}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            ) : null}
        </>
    );
}