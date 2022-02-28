import "../styles/App.css";
import { Form } from "react-bootstrap";

function handleSumbit(event) {
    event.preventDefault();
}

export const AddGroupe = (props) => {
    const groups = props.groups;
    const selectedGroup = props.selectedGroup;
    const setSelectedGroup = props.setSelectedGroup;
    const setSelectedGroupId = props.setSelectedGroupId;
    return (
        <>
            {groups ? (
                    <Form.Group controlId="groups">
                        <Form.Label>Group</Form.Label>
                        <Form.Control
                            as="select"
                            defaultValue={selectedGroup}
                            onChange={(e) => {
                                setSelectedGroup(e.target.value);
                                setSelectedGroupId((groups.filter(group => group.value === e.target.value))[0].appGroupId);
                            }}
                        >
                            {groups.map((group, index) => (
                                <option key={index}>{group.value}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
            ) : null}
        </>
    );
}