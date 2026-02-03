import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";

import type {Employee} from "../types";

interface EmployeeFormProps {
    formData: Employee;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

// Formular für Mitarbeiter-Stammdaten
export function EmployeeForm({formData, onChange, onSubmit, loading}: EmployeeFormProps) {
    return (
        <Form onSubmit={onSubmit} className="shadow-sm p-4 bg-white rounded">
            <h5 className="mb-3">Stammdaten</h5>

            <Row>
                <Col md={6} className="mb-3">
                    <Form.Group controlId="firstName">
                        <Form.Label>Vorname *</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={onChange}
                            required
                            placeholder="Max"
                        />
                    </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                    <Form.Group controlId="lastName">
                        <Form.Label>Nachname *</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={onChange}
                            required
                            placeholder="Mustermann"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={8} className="mb-3">
                    <Form.Group controlId="street">
                        <Form.Label>Straße *</Form.Label>
                        <Form.Control
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={onChange}
                            required
                            placeholder="Musterstraße 123"
                        />
                    </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                    <Form.Group controlId="postcode">
                        <Form.Label>PLZ *</Form.Label>
                        <Form.Control
                            type="text"
                            name="postcode"
                            value={formData.postcode}
                            onChange={onChange}
                            required
                            placeholder="12345"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6} className="mb-3">
                    <Form.Group controlId="city">
                        <Form.Label>Ort *</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={onChange}
                            required
                            placeholder="Berlin"
                        />
                    </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                    <Form.Group controlId="phone">
                        <Form.Label>Telefon *</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={onChange}
                            required
                            placeholder="030 123456"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex justify-content-between mt-4">
                <Link to="/employees">
                    <Button variant="outline-secondary" type="button">Abbrechen</Button>
                </Link>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <><Spinner size="sm" className="me-2" />Speichert...</> : "Speichern"}
                </Button>
            </div>
        </Form>
    );
}
