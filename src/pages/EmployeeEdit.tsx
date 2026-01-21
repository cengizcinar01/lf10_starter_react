import {useEffect, useState} from "react";
import {Alert, Button, Container, Form, Spinner} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {useEmployeeApi} from "../hooks/useEmployeeApi";
import type {Employee} from "../types";

export function EmployeeEdit() {
    const {id} = useParams();
    const parsedId = id !== undefined ? Number(id) : undefined;
    const isNew = parsedId === undefined || Number.isNaN(parsedId);

    const {getEmployeeById, loading, error} = useEmployeeApi();

    // Initial state for form fields
    const [formData, setFormData] = useState<Employee>({
        firstName: "",
        lastName: "",
        street: "",
        postcode: "",
        city: "",
        phone: "",
        skillSet: []
    });

    // Load data if editing
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Speichern:", formData);
        alert("Speichern ist noch nicht implementiert (Next Ticket!)");
    };

    return (
        <Container className="mt-4">
            <h1 className="mb-4">{isNew ? "Neuen Mitarbeiter anlegen" : "Mitarbeiter bearbeiten"}</h1>

            {loading && <div className="text-center my-3"><Spinner animation="border"/></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && (
                <Form onSubmit={handleSubmit} className="shadow-sm p-4 bg-white rounded">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Form.Group controlId="firstName">
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
                            <Form.Group controlId="lastName">
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
                            <Form.Group controlId="street">
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
                            <Form.Group controlId="postcode">
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
                            <Form.Group controlId="city">
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
                            <Form.Group controlId="phone">
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

                    <div className="d-flex justify-content-between mt-4">
                        <Link to="/employees">
                            <Button variant="outline-secondary">Abbrechen</Button>
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