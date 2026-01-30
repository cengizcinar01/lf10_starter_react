import React, { useEffect, useState } from "react";
import { Button, Container, Form, InputGroup, ListGroup, Alert, Spinner } from "react-bootstrap";
import { useQualificationApi } from "../hooks/useQualificationApi";
import type { Qualification } from "../types";

export function QualificationList() {
    const { fetchQualifications, createQualification, deleteQualification, loading, error } = useQualificationApi();
    
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [newSkill, setNewSkill] = useState("");

    // Daten holen
    useEffect(() => {
        loadData();
    }, [fetchQualifications]);

    const loadData = async () => {
        const data = await fetchQualifications();
        setQualifications(data);
    };

    // Handler zum Hinzufügen
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSkill.trim()) return;

        const createdQuali = await createQualification(newSkill);
        if (createdQuali) {
            setQualifications([...qualifications, createdQuali]);
            setNewSkill(""); // Input leeren
        }
    };

    // Handler zum Löschen
    const handleDelete = async (id: number) => {
        const success = await deleteQualification(id);
        if (success) {
            setQualifications(qualifications.filter(q => q.id !== id));
        }
    };

    return (
        <Container className="mt-4">
            <h1>Qualifikations-Verwaltung</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Formular zum Hinzufügen */}
            <Form onSubmit={handleAdd} className="my-4">
                <Form.Group>
                    <Form.Label>Neue Qualifikation hinzufügen</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="z.B. Java, React, SQL"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" variant="success" disabled={loading || !newSkill.trim()}>
                            Hinzufügen
                        </Button>
                    </InputGroup>
                </Form.Group>
            </Form>

            {/* Lade-Indikator oder Liste */}
            {loading && qualifications.length === 0 ? (
                <Spinner animation="border" />
            ) : (
                <ListGroup>
                    {qualifications.map((q) => (
                        <ListGroup.Item key={q.id} className="d-flex justify-content-between align-items-center">
                            <span>{q.skill}</span>
                            <Button 
                                variant="outline-danger" 
                                size="sm" 
                                onClick={() => q.id && handleDelete(q.id)}
                                disabled={loading}
                            >
                                Löschen
                            </Button>
                        </ListGroup.Item>
                    ))}
                    {qualifications.length === 0 && !loading && (
                        <p className="text-muted mt-3">Keine Qualifikationen vorhanden.</p>
                    )}
                </ListGroup>
            )}
        </Container>
    );
}
