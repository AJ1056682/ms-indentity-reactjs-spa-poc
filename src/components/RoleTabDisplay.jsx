import "../styles/App.css";
import { Form } from "react-bootstrap";

function handleSumbit(event) {
    event.preventDefault();
}

export const AddRole = (props) => {
    const roles = props.roles;
    const selectedRole = props.selectedRole;
    const setSelectedRole = props.setSelectedRole;
    const setSelectedRoleId = props.setSelectedRoleId;
    return (
        <>
            {roles ? (
                    <Form.Group controlId="roles">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            as="select"
                            defaultValue={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                                setSelectedRoleId((roles.filter(role => role.value === e.target.value))[0].appRoleId);
                            }}
                        >
                            {roles.map((role, index) => (
                                <option key={index}>{role.value}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
            ) : null}
        </>
    );
}