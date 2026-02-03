import {useEffect, useRef, useState} from "react";
import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";

import {EmployeeSkillManager} from "../components/EmployeeSkillManager";
import {FeedbackAlert} from "../components/FeedbackAlert";
import {useEmployeeApi} from "../hooks/useEmployeeApi";
import {useQualificationApi} from "../hooks/useQualificationApi";
import type {Employee, Qualification} from "../types";

// Formular zum Erstellen/Bearbeiten von Mitarbeitern
export function EmployeeEdit() {
    const {id} = useParams();
    const parsedId = id !== undefined ? Number(id) : undefined;
    const isNew = parsedId === undefined || Number.isNaN(parsedId);
    const navigate = useNavigate();

    const {
        getEmployeeById,
        createEmployee,
        updateEmployee,
        addSkillToEmployee,
        removeSkillFromEmployee,
        loading,
        error
    } = useEmployeeApi();
    const {fetchQualifications} = useQualificationApi();

    const [formData, setFormData] = useState<Employee>({
        firstName: "",
        lastName: "",
        street: "",
        postcode: "",
        city: "",
        phone: "",
        skillSet: []
    });

    const [allQualifications, setAllQualifications] = useState<Qualification[]>([]);
    const [skillLoading, setSkillLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    // Ref um doppeltes Laden zu verhindern
    const hasLoaded = useRef(false);

    // Qualifikationen laden
    const loadQualifications = async () => {
        const data = await fetchQualifications();
        if (data) setAllQualifications(data);
    };

    // Mitarbeiter laden (bei Bearbeitung)
    const loadEmployee = async (empId: number) => {
        const data = await getEmployeeById(empId);
        if (data) setFormData(data);
    };


    useEffect(() => {
        if (!hasLoaded.current) {
            hasLoaded.current = true;
            loadQualifications();
            if (!isNew && parsedId) {
                loadEmployee(parsedId);
            }
        }
    }, [isNew, parsedId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let success = false;

        if (isNew) {
            const result = await createEmployee(formData);
            success = !!result;
        } else if (parsedId) {
            const result = await updateEmployee(parsedId, formData);
            success = !!result;
        }

        if (success && !error) {
            setFeedback({type: "success", message: "Gespeichert!"});
            setTimeout(() => navigate("/employees"), 1500);
        } else if (error) {
            setFeedback({type: "danger", message: error});
        }
    };

    // Skill hinzufügen
    const handleAddSkill = async (skillId: number) => {
        if (!parsedId) return;
        const skill = allQualifications.find(q => q.id === skillId);
        if (!skill) return;
        setSkillLoading(true);
        const result = await addSkillToEmployee(parsedId, skill.skill);
        setSkillLoading(false);
        if (result) {
            await loadEmployee(parsedId);
            setFeedback({type: "success", message: "Qualifikation hinzugefügt!"});
        }
    };

    // Skill entfernen
    const handleRemoveSkill = async (skillId: number) => {
        if (!parsedId) return;
        setSkillLoading(true);
        const success = await removeSkillFromEmployee(parsedId, skillId);
        setSkillLoading(false);
        if (success) {
            setFormData((prev) => ({
                ...prev,
                skillSet: prev.skillSet.filter((s) => s.id !== skillId)
            }));
            setFeedback({type: "success", message: "Qualifikation entfernt!"});
        }
    };

    return (
        <Container className="mt-4">
            <div className="mb-3">
                <Link to="/employees" className="text-decoration-none">
                    ← Zurück zur Übersicht
                </Link>
            </div>

            <h1 className="mb-4">{isNew ? "Neuen Mitarbeiter anlegen" : "Mitarbeiter bearbeiten"}</h1>

            {feedback && (
                <FeedbackAlert
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback(null)}
                />
            )}

            {error && !feedback && <Alert variant="danger">{error}</Alert>}

            {loading && (
                <div className="text-center my-3">
                    <Spinner animation="border" />
                </div>
            )}

            {!loading && (
                <Row>
                    <Col lg={isNew ? 12 : 7}>
                        <Form onSubmit={handleSubmit} className="shadow-sm p-4 bg-white rounded">
                            <h5 className="mb-3">Stammdaten</h5>

                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="firstName">
                                        <Form.Label>Vorname *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                    </Col>

                    {!isNew && (
                        <Col lg={5} className="mt-4 mt-lg-0">
                            <EmployeeSkillManager
                                currentSkills={formData.skillSet}
                                availableSkills={allQualifications}
                                onAddSkill={handleAddSkill}
                                onRemoveSkill={handleRemoveSkill}
                                loading={skillLoading}
                            />
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
}
