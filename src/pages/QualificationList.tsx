import React, {useEffect, useRef, useState} from "react";
import {Button, Container, Form, InputGroup, ListGroup, Spinner} from "react-bootstrap";

import {ConfirmModal} from "../components/ConfirmModal";
import {FeedbackAlert} from "../components/FeedbackAlert";
import {QualificationRow} from "../components/QualificationRow";
import {useQualificationApi} from "../hooks/useQualificationApi";
import type {Qualification} from "../types";

// Qualifikationskatalog verwalten
export function QualificationList() {
    const {fetchQualifications, createQualification, deleteQualification, loading, error} = useQualificationApi();

    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [newSkill, setNewSkill] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [qualiToDelete, setQualiToDelete] = useState<Qualification | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    const hasLoaded = useRef(false);

    const loadData = async () => {
        const data = await fetchQualifications();
        setQualifications(data);
    };


    useEffect(() => {
        if (!hasLoaded.current) {
            hasLoaded.current = true;
            loadData();
        }
    }, []);

    const filtered = qualifications.filter((q) => q.skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSkill.trim()) return;
        const created = await createQualification(newSkill);
        if (created) {
            setQualifications([...qualifications, created]);
            setNewSkill("");
            setFeedback({type: "success", message: `"${newSkill}" wurde erstellt.`});
        } else if (error) {
            setFeedback({type: "danger", message: error});
        }
    };

    const handleDeleteClick = (q: Qualification) => {
        setQualiToDelete(q);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!qualiToDelete?.id) return;
        setDeleteLoading(true);
        const success = await deleteQualification(qualiToDelete.id);
        setDeleteLoading(false);
        setShowDeleteModal(false);
        if (success) {
            setQualifications(qualifications.filter((q) => q.id !== qualiToDelete.id));
            setFeedback({type: "success", message: `"${qualiToDelete.skill}" gelöscht.`});
        } else if (error) {
            setFeedback({type: "danger", message: error});
        }
        setQualiToDelete(null);
    };

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Qualifikations-Verwaltung</h1>
            <p className="text-muted">Katalog der verfügbaren Skills.</p>

            {feedback &&
                <FeedbackAlert type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)}/>}

            {/* Neue Quali erstellen */}
            <Form onSubmit={handleAdd} className="my-4 p-3 bg-light rounded">
                <Form.Group>
                    <Form.Label className="fw-bold">Neue Qualifikation</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="z.B. Java, React, SQL..."
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

            {/* Suche */}
            <Form.Group className="mb-3">
                <Form.Label>Suchen</Form.Label>
                <Form.Control type="text" placeholder="Bezeichnung..." value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}/>
            </Form.Group>

            {loading && qualifications.length === 0 ? (
                <div className="text-center my-4"><Spinner animation="border"/></div>
            ) : (
                <>
                    <ListGroup className="shadow-sm">
                        {filtered.length === 0 ? (
                            <ListGroup.Item className="text-muted text-center py-4">
                                {qualifications.length === 0 ? "Noch keine Skills vorhanden." : "Keine Treffer."}
                            </ListGroup.Item>
                        ) : (
                            filtered.map((q) => <QualificationRow key={q.id} qualification={q}
                                                                  onDelete={handleDeleteClick} disabled={loading}/>)
                        )}
                    </ListGroup>

                    {qualifications.length > 0 && <div
                        className="text-muted small mt-3">{filtered.length} von {qualifications.length} angezeigt</div>}
                </>
            )}

            <ConfirmModal
                show={showDeleteModal}
                title="Qualifikation löschen"
                message={qualiToDelete ? `"${qualiToDelete.skill}" wirklich löschen?` : ""}
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setQualiToDelete(null);
                }}
                loading={deleteLoading}
            />
        </Container>
    );
}
