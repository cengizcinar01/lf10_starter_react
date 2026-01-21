import {useEffect, useState} from "react";
import {Button, Container, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import type {Employee} from "../types";

// 1. Mock-Daten (Statische Daten zum Testen des UIs)
// Später kommen diese Daten aus dem Backend (useEmployeeApi)
const MOCK_DATA: Employee[] = [
    {
        id: 1,
        firstName: "Max",
        lastName: "Mustermann",
        city: "Berlin",
        street: "Musterstraße 1",
        postcode: "10115",
        phone: "030 123456",
        skillSet: [{id: 1, skill: "Projektmanagement"}, {id: 2, skill: "Softwareentwicklung"}]
    },
    {
        id: 2,
        firstName: "Anna",
        lastName: "Schmidt",
        city: "Hamburg",
        street: "Hafenstraße 10",
        postcode: "20357",
        phone: "040 987654",
        skillSet: [{id: 3, skill: "Kundenbetreuung"}]
    },
    {
        id: 3,
        firstName: "Peter",
        lastName: "Müller",
        city: "München",
        street: "Isarweg 5",
        postcode: "80331",
        phone: "089 555123",
        skillSet: [{id: 4, skill: "Datenanalyse"}]
    }
];

export function EmployeeList() {
    // State für die Mitarbeiter-Liste
    const [employees, setEmployees] = useState<Employee[]>([]);

    // Beim Laden der Komponente die Daten setzen
    useEffect(() => {
        // Hier würden wir später fetchEmployees() aufrufen.
        // Für jetzt nutzen wir die Mock-Daten:
        setEmployees(MOCK_DATA);
    }, []);

    // Platzhalter-Funktion für das Löschen
    const handleDelete = (id?: number) => {
        if (confirm("Möchten Sie diesen Mitarbeiter wirklich löschen?")) {
            console.log("Lösche Mitarbeiter mit ID:", id);
            // Später: API Aufruf zum Löschen
        }
    };

    return (
        <Container className="mt-4">
            {/* Kopfbereich: Titel und Neuer Mitarbeiter Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mitarbeiterübersicht</h1>
                <Link to="/employees/new">
                    <Button variant="primary">Neuer Mitarbeiter</Button>
                </Link>
            </div>

            {/* Tabelle */}
            <div className="table-responsive shadow-sm p-3 mb-5 bg-white rounded">
                <Table hover className="align-middle">
                    <thead className="table-light">
                    <tr>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Ort</th>
                        <th>Qualifikationen</th>
                        <th className="text-end">Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td>{employee.city}</td>
                            <td>
                                {/* Kleine Badges für Skills anzeigen */}
                                {employee.skillSet.map(skill => (
                                    <span key={skill.id} className="badge bg-light text-dark me-1 border">
                                            {skill.skill}
                                        </span>
                                ))}
                            </td>
                            <td className="text-end">
                                {/* Bearbeiten Button (Link) */}
                                <Link to={`/employees/${employee.id}`} className="me-2">
                                    <Button variant="outline-secondary" size="sm">
                                        Bearbeiten
                                    </Button>
                                </Link>

                                {/* Löschen Button */}
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(employee.id)}
                                >
                                    Löschen
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}