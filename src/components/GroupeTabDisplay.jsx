import "../styles/App.css";
import { Form } from "react-bootstrap";

function handleSumbit(event) {
    event.preventDefault();
}

export const AddGroupe = (props) => {
    const groupes = props.roles;
    const selectedGroupe = props.selectedGroupe;
    const setSelectedGroupe = props.setSelectedGroupe;
    return (
        <>
            {roles ? (
                <Form onSubmit={handleSumbit}>
                    <Form.Group controlId="roles">
                        <Form.Label>Groupe</Form.Label>
                        <Form.Control
                            as="select"
                            defaultValue={selectedGroupe}
                            onChange={(e) => {
                                setSelectedGroupe(e.target.value);
                            }}
                        >
                            {groupes.map((groupe, index) => (
                                <option key={index}>{groupe}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            ) : null}
        </>
    );
}