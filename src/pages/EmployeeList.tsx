import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Employee } from "../types";
import { useEmployeeApi } from "../hooks/useEmployeeApi";

export function EmployeeList() {
    // Filter-States
    const [searchName, setSearchName] = useState("");
    const [searchCity, setSearchCity] = useState("");
    const [searchSkill, setSearchSkill] = useState("");

    // State für Mitarbeiter
    const [employees, setEmployees] = useState<Employee[]>([]);
    const { fetchEmployees, deleteEmployee, loading, error } = useEmployeeApi();

    //Gehälter-State
    const [salaries, setSalaries] = useState<Record<number, string>>({});


    // Daten laden
    const loadData = async () => {
        const data = await fetchEmployees();
        if (data) {
            setEmployees(data);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const storedSalaries = localStorage.getItem("employeeSalaries");
        if (storedSalaries) {
            setSalaries(JSON.parse(storedSalaries));
        }
    }, []);


    // Filterlogik
    const filteredEmployees = employees.filter((employee) => {
        const nameMatch =
            employee.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
            employee.lastName.toLowerCase().includes(searchName.toLowerCase());

        const cityMatch =
            employee.city.toLowerCase().includes(searchCity.toLowerCase());

        const skillMatch =
            searchSkill === "" ||
            employee.skillSet?.some((skill) =>
                skill.skill.toLowerCase().includes(searchSkill.toLowerCase())
            );

        return nameMatch && cityMatch && skillMatch;
    });

    // Löschen
    const handleDelete = async (id?: number) => {
        if (id !== undefined && confirm("Möchten Sie diesen Mitarbeiter wirklich löschen?")) {
            await deleteEmployee(id);
            loadData();
        }
    };

    return (
        <Container className="mt-4">
            {/* Kopfbereich */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Mitarbeiterübersicht</h1>
                <Link to="/employees/new">
                    <Button variant="primary">Neuer Mitarbeiter</Button>
                </Link>
            </div>

            {/* Filterfelder */}
            <div className="mb-3 d-flex gap-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Name suchen"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ort suchen"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Qualifikation suchen"
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                />
            </div>

            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <div className="table-responsive shadow-sm p-3 mb-5 bg-white rounded">
                    <Table hover className="align-middle">
                        <thead className="table-light">
                        <tr>
                            <th>Vorname</th>
                            <th>Nachname</th>
                            <th>Ort</th>
                            <th>Qualifikationen</th>
                            <th>Gehalt (€)</th>
                            <th className="text-end">Aktionen</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredEmployees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.firstName}</td>
                                <td>{employee.lastName}</td>
                                <td>{employee.city}</td>
                                <td>
                                    {employee.skillSet?.map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="badge bg-light text-dark me-1 border"
                                        >
                                                {skill.skill}
                                            </span>
                                    ))}
                                </td>
                                <td>
                                    {salaries[employee.id ?? 0]
                                        ? `${Number(salaries[employee.id ?? 0]).toLocaleString("de-DE")} €`
                                        : "—"}
                                </td>

                                <td className="text-end">
                                    <Link
                                        to={`/employees/${employee.id}`}
                                        className="me-2"
                                    >
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                        >
                                            Bearbeiten
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() =>
                                            handleDelete(employee.id)
                                        }
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
