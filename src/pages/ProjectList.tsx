import React, { useState, useEffect } from "react";
import { Button, Container, Form, InputGroup, ListGroup } from "react-bootstrap";


import { ConfirmModal } from "../components/ConfirmModal";
import { FeedbackAlert } from "../components/FeedbackAlert";
import { useProjectApi } from "../hooks/useProjectApi";
import type { Project } from "../types";

export function ProjectList() {
    const { projects, createProject, deleteProject, clearAllProjects } = useProjectApi();

    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [feedback, setFeedback] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    const filtered = projects.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Hinzufügen 
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        await createProject(newName, newDesc);
        
        setNewName("");
        setNewDesc("");
        setFeedback({ type: "success", message: `Projekt "${newName}" wurde gespeichert.` });
    };

    const handleDeleteClick = (p: Project) => {
        setProjectToDelete(p);
        setShowDeleteModal(true);
    };

    // Löschen 
    const handleDeleteConfirm = async () => {
        if (!projectToDelete) return;
        await deleteProject(projectToDelete.id);
        
        setFeedback({ type: "success", message: `Projekt "${projectToDelete.name}" entfernt.` });
        setShowDeleteModal(false);
        setProjectToDelete(null);
    };

    const handleClearAll = async () => {
        if (window.confirm("Möchtest du wirklich ALLE Projekte unwiderruflich löschen?")) {
            await clearAllProjects();
            setFeedback({ type: "danger", message: "Alle Projekte wurden gelöscht." });
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Projekt-Verwaltung</h1>
            <p className="text-muted">Hier Können Projekte verwaltet werden</p>

            {feedback && <FeedbackAlert type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} />}

            {/* Eingabe Formular */}
            <Form onSubmit={handleAdd} className="my-4 p-3 bg-light rounded shadow-sm">
                <Form.Label className="fw-bold">Neues Projekt</Form.Label>
                <Form.Control  className="mb-2" placeholder="Name des Projekts" value={newName} 
                                onChange={(e) => setNewName(e.target.value)}/>
                <InputGroup>
                    <Form.Control 
                        placeholder="Kurze Beschreibung" 
                        value={newDesc} 
                        onChange={(e) => setNewDesc(e.target.value)} 
                    />
                </InputGroup>
                <div className="d-flex justify-content-end mt-3">
                    <Button type="submit" variant="success" disabled={!newName.trim()} className="px-5">
                        Hinzufügen
                    </Button>
                </div>
            </Form>

            {/* Suche */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Suchen</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Nach Namen filtern..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form.Group>

            {/* Die Liste */}
            <ListGroup className="shadow-sm">
                {filtered.length === 0 ? (
                    <ListGroup.Item className="text-muted text-center py-4">
                        Keine Projekte gefunden.
                    </ListGroup.Item>
                ) : (
                    filtered.map((p) => (
                        <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{p.name}</strong>
                                <div className="small text-muted">{p.description}</div>
                            </div>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(p)}>
                                Löschen
                            </Button>
                        </ListGroup.Item>
                    ))
                )}
            </ListGroup>

            {/* "Alle löschen" */}
            {projects.length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                    <Button variant="danger" size="sm" onClick={handleClearAll}>
                        Alle Projekte löschen
                    </Button>
                </div>
            )}

            <ConfirmModal 
                show={showDeleteModal} 
                title="Projekt entfernen" 
                message={`Möchtest du "${projectToDelete?.name}" wirklich löschen?`} 
                onConfirm={handleDeleteConfirm} 
                onCancel={() => setShowDeleteModal(false)} 
            />
        </Container>
    );
}