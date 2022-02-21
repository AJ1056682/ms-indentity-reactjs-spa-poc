import "../styles/App.css";
import { Form } from "react-bootstrap";

function handleSumbit(event) {
    event.preventDefault();
}

export const AddGroupe = (props) => {
    const groupes = props.groupes;
    const selectedGroupe = props.selectedGroupe;
    const setSelectedGroupe = props.setSelectedGroupe;
    return (
        <>
            {groupes ? (
                    <Form.Group controlId="groupes">
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
            ) : null}
        </>
    );
}