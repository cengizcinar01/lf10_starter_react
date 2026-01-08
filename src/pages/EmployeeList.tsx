import {Button, Container} from "react-bootstrap";
import {Link} from "react-router-dom";

export function EmployeeList() {
    return (
        <Container className="mt-4">
            <h1>Mitarbeiter Übersicht</h1>
            <Link to="/employees/new">
                <Button variant="primary" className="mb-3">+ Neuer Mitarbeiter</Button>
            </Link>
            <p>Hier kommt später die Tabelle hin.</p>
        </Container>
    );
}