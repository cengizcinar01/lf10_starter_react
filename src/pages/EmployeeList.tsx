import {useEffect, useState} from "react";
import {Alert, Button, Container, Spinner, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import type {Employee} from "../types";
import {useEmployeeApi} from "../hooks/useEmployeeApi";

export function EmployeeList() {
    // State für die Mitarbeiter-Liste
    const [employees, setEmployees] = useState<Employee[]>([]);
    const {fetchEmployees, loading, error} = useEmployeeApi();

    // Beim Laden der Komponente die Daten holen
    useEffect(() => {
        const loadData = async () => {
            const data = await fetchEmployees();
            if (data) {
                setEmployees(data);
            }
        };
        loadData();
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

            {loading && <div className="text-center my-5"><Spinner animation="border"/></div>}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                /* Tabelle */
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
                                    {employee.skillSet && employee.skillSet.map(skill => (
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
            )}
        </Container>
    );
}