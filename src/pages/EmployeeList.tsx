import { useEffect, useState } from "react";
import { Button, Container, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEmployeeApi, type Employee } from "../hooks/useEmployeeApi";

export function EmployeeList() {
    const { getAllEmployees, loading, error } = useEmployeeApi();
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await getAllEmployees();
            if (data) setEmployees(data);
        };
        loadData();
    }, []);

    return (
        <Container className="mt-4">
            <h1>Mitarbeiter Übersicht</h1>
            <Link to="/employees/new">
                <Button variant="primary" className="mb-3">+ Neuer Mitarbeiter</Button>
            </Link>

            {loading && (
                <div className="my-4 text-center">
                    <Spinner animation="border" variant="primary" /> <p>Lädt...</p>
                </div>
            )}

            {error && <Alert variant="danger">Fehler: {error}</Alert>}

            {!loading && !error && (
                <pre className="bg-light p-3 border mt-3">
                    {JSON.stringify(employees, null, 2)}
                </pre>
            )}
        </Container>
    );
}