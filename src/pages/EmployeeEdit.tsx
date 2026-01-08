import {Container} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";

export function EmployeeEdit() {
    const {id} = useParams(); // Holt die ID aus der URL, falls vorhanden
    const isNew = !id; // Wenn keine ID da ist, legen wir neu an

    return (
        <Container className="mt-4">
            <h1>{isNew ? "Neuen Mitarbeiter anlegen" : "Mitarbeiter bearbeiten"}</h1>
            <p>Hier kommt das Formular hin.</p>
            <Link to="/employees">Zurück zur Übersicht</Link>
        </Container>
    );
}