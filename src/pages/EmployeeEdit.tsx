import { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEmployeeApi } from "../hooks/useEmployeeApi";
import { useQualificationApi } from "../hooks/useQualificationApi";
import type { Employee, Qualification } from "../types";

export function EmployeeEdit() {
    const { id } = useParams();
    const parsedId = id !== undefined ? Number(id) : undefined;
    const isNew = parsedId === undefined || Number.isNaN(parsedId);

    const navigate = useNavigate();

    const {
        getEmployeeById,
        createEmployee,
        updateEmployee,
        addQualificationToEmployee,
        loading,
        error
    } = useEmployeeApi();

    const { getAllQualifications } = useQualificationApi();

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
    const [selectedQualificationId, setSelectedQualificationId] = useState<number | "">("");

    // Mitarbeiter laden (Edit)
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

    // Qualifikationen laden (Dropdown)
    useEffect(() => {
        const loadQualifications = async () => {
            const data = await getAllQualifications();
            if (data) {
                setAllQualifications(data);
            }
        };
        loadQualifications();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill =  async () => {
        if (selectedQualificationId === "" || !parsedId) return;

        await addQualificationToEmployee(parsedId, selectedQualificationId);

         const skillToAdd = allQualifications.find(
    q => q.id === selectedQualificationId
        );

        if (!skillToAdd) return;

        const alreadyExists = formData.skillSet.some(
            s => s.id === skillToAdd.id
        );

        if (alreadyExists) return;

        setFormData(prev => ({
            ...prev,
            skillSet: [...prev.skillSet, skillToAdd]
        }));

        setSelectedQualificationId("");

         navigate("/employees", { replace: true });
    };

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
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>

                    {/* ===== Skills ===== */}
                    <hr />
                    <h5>Skills</h5>

                    <ul>
                        {formData.skillSet.map(skill => (
                            <li key={skill.id}>{skill.skill}</li>
                        ))}
                        {formData.skillSet.length === 0 && (
                            <li className="text-muted">Keine Skills zugewiesen</li>
                        )}
                    </ul>

                    <div className="d-flex gap-2 mb-4">
                        <Form.Select
                            value={selectedQualificationId}
                            onChange={e => setSelectedQualificationId(Number(e.target.value))}
                        >
                            <option value="">Skill auswählen</option>
                            {allQualifications.map(q => (
                                <option key={q.id} value={q.id}>
                                    {q.skill}
                                </option>
                            ))}
                        </Form.Select>

                        <Button variant="secondary" onClick={handleAddSkill}>
                            Hinzufügen
                        </Button>
                    </div>

                    <div className="d-flex justify-content-between">
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
