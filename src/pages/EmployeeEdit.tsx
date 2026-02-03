import {useEffect, useRef, useState} from "react";
import {Alert, Col, Container, Row, Spinner} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";

import {EmployeeForm} from "../components/EmployeeForm";
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

    const {getEmployeeById, createEmployee, updateEmployee, addSkillToEmployee, removeSkillFromEmployee, loading, error} = useEmployeeApi();
    const {fetchQualifications} = useQualificationApi();

    const [formData, setFormData] = useState<Employee>({
        firstName: "", lastName: "", street: "", postcode: "", city: "", phone: "", skillSet: []
    });
    const [allQualifications, setAllQualifications] = useState<Qualification[]>([]);
    const [skillLoading, setSkillLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    const hasLoaded = useRef(false);

    const loadEmployee = async (empId: number) => {
        const data = await getEmployeeById(empId);
        if (data) setFormData(data);
    };


    useEffect(() => {
        if (!hasLoaded.current) {
            hasLoaded.current = true;
            fetchQualifications().then(setAllQualifications);
            if (!isNew && parsedId) loadEmployee(parsedId);
        }
    }, [isNew, parsedId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = isNew
            ? await createEmployee(formData)
            : parsedId ? await updateEmployee(parsedId, formData) : null;

        if (result && !error) {
            setFeedback({type: "success", message: "Gespeichert!"});
            setTimeout(() => navigate("/employees"), 1500);
        } else if (error) {
            setFeedback({type: "danger", message: error});
        }
    };

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

    const handleRemoveSkill = async (skillId: number) => {
        if (!parsedId) return;
        setSkillLoading(true);
        const success = await removeSkillFromEmployee(parsedId, skillId);
        setSkillLoading(false);
        if (success) {
            setFormData((prev) => ({...prev, skillSet: prev.skillSet.filter((s) => s.id !== skillId)}));
            setFeedback({type: "success", message: "Qualifikation entfernt!"});
        }
    };

    return (
        <Container className="mt-4">
            <div className="mb-3">
                <Link to="/employees" className="text-decoration-none">← Zurück zur Übersicht</Link>
            </div>

            <h1 className="mb-4">{isNew ? "Neuen Mitarbeiter anlegen" : "Mitarbeiter bearbeiten"}</h1>

            {feedback && <FeedbackAlert type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} />}
            {error && !feedback && <Alert variant="danger">{error}</Alert>}
            {loading && <div className="text-center my-3"><Spinner animation="border" /></div>}

            {!loading && (
                <Row>
                    <Col lg={isNew ? 12 : 7}>
                        <EmployeeForm
                            formData={formData}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            loading={loading}
                        />
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
