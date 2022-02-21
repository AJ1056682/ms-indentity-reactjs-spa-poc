import "../styles/App.css";
import { Button } from "react-bootstrap";

function handleSumbit(event, selectedRole, email) {
    event.preventDefault();
    console.log(selectedRole, email);
}

export const ButtonAssignRoleComponent = (props) => {
    const selectedRole = props.selectedRole;
    const email = props.email;
    console.log(selectedRole, email);
    return (
        <>
            <Button variant="primary" type="submit" onClick={(event) => handleSumbit(event, selectedRole, email)}>
                Assign Role
            </Button>
        </>
    );
}