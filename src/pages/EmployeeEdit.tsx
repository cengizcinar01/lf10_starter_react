import { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEmployeeApi } from "../hooks/useEmployeeApi";
import type { Employee } from "../types";

export function EmployeeEdit() {
    const { id } = useParams();
    const parsedId = id !== undefined ? Number(id) : undefined;
    const isNew = parsedId === undefined || Number.isNaN(parsedId);

    const navigate = useNavigate();

    const {
        getEmployeeById,
        createEmployee,
        updateEmployee,
        loading,
        error,
    } = useEmployeeApi();

    // Mitarbeiter-Stammdaten
    const [formData, setFormData] = useState<Employee>({
        firstName: "",
        lastName: "",
        street: "",
        postcode: "",
        city: "",
        phone: "",
        skillSet: [],
    });

    // 🔹 Gehalt (nur Frontend / localStorage)
    const [salary, setSalary] = useState<string>("");

    // Mitarbeiter laden (bei Bearbeiten)
    useEffect(() => {
        if (!isNew && parsedId) {
            const loadEmployee = async () => {
                const data = await getEmployeeById(parsedId);
                if (data) {
                    setFormData(data);
                }
            };
            loadEmployee();
        }
    }, [isNew, parsedId]);

    // 🔹 Gehalt aus localStorage laden
    useEffect(() => {
        if (!parsedId) return;

        const stored = localStorage.getItem("employeeSalaries");
        if (stored) {
            const salaries = JSON.parse(stored);
            setSalary(salaries[parsedId] ?? "");
        }
    }, [parsedId]);

    // Formularfelder ändern
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 🔹 Gehalt setzen + validieren
    const handleSalaryChange = (value: string) => {
        const numericValue = Number(value);

        if (isNaN(numericValue)) return;
        if (numericValue < 0) return;
        if (numericValue > 20000) return;

        setSalary(value);

        if (!parsedId) return;

        const stored = localStorage.getItem("employeeSalaries");
        const salaries = stored ? JSON.parse(stored) : {};

        salaries[parsedId] = value;

        localStorage.setItem(
            "employeeSalaries",
            JSON.stringify(salaries)
        );
    };

    // Speichern
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isNew) {
            await createEmployee(formData);
        } else if (parsedId) {
            await updateEmployee(parsedId, formData);
        }

        if (!error) {
            navigate("/employees");
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="mb-4">
                {isNew ? "Neuen Mitarbeiter anlegen" : "Mitarbeiter bearbeiten"}
            </h1>

            {loading && (
                <div className="text-center my-3">
                    <Spinner animation="border" />
                </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && (
                <Form onSubmit={handleSubmit} className="shadow-sm p-4 bg-white rounded">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Form.Group>
                                <Form.Label>Vorname</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6 mb-3">
                            <Form.Group>
                                <Form.Label>Nachname</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-8 mb-3">
                            <Form.Group>
                                <Form.Label>Straße</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-4 mb-3">
                            <Form.Group>
                                <Form.Label>PLZ</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="postcode"
                                    value={formData.postcode}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Form.Group>
                                <Form.Label>Ort</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6 mb-3">
                            <Form.Group>
                                <Form.Label>Telefon</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>

                    {/* 🔹 GEHALT */}
                    {!isNew && (
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Gehalt (€)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step={100}
                                        value={salary}
                                        onChange={(e) =>
                                            handleSalaryChange(e.target.value)
                                        }
                                        placeholder="z. B. 4.500"
                                    />
                                    {salary && (
                                        <small className="text-muted">
                                            {Number(salary).toLocaleString("de-DE")} €
                                        </small>
                                    )}
                                </Form.Group>
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                        <Link to="/employees">
                            <Button variant="outline-secondary">
                                Abbrechen
                            </Button>
                        </Link>
                        <Button variant="primary" type="submit">
                            Speichern
                        </Button>
                    </div>
                </Form>
            )}
        </Container>
    );
}
