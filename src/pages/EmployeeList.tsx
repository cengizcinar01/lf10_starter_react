import {useEffect, useRef, useState} from "react";
import {Alert, Button, Container, Spinner, Table} from "react-bootstrap";
import {Link} from "react-router-dom";

import {ConfirmModal} from "../components/ConfirmModal";
import {EmployeeFilter} from "../components/EmployeeFilter";
import {FeedbackAlert} from "../components/FeedbackAlert";
import {useEmployeeApi} from "../hooks/useEmployeeApi";
import {useQualificationApi} from "../hooks/useQualificationApi";
import type {Employee, Qualification} from "../types";

// Mitarbeiter-Übersicht mit Filter und CRUD
export function EmployeeList() {
    const {fetchEmployees, deleteEmployee, loading, error} = useEmployeeApi();
    const {fetchQualifications} = useQualificationApi();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [allQualifications, setAllQualifications] = useState<Qualification[]>([]);

    // Filter-Werte
    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [skillFilter, setSkillFilter] = useState<number[]>([]);

    // Modal fürs Löschen
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Feedback (Erfolg/Fehler)
    const [feedback, setFeedback] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    // Ref um doppeltes Laden zu verhindern
    const hasLoaded = useRef(false);

    // Daten laden
    const loadData = async () => {
        const [employeeData, qualificationData] = await Promise.all([
            fetchEmployees(),
            fetchQualifications()
        ]);
        if (employeeData) setEmployees(employeeData);
        if (qualificationData) setAllQualifications(qualificationData);
    };


    useEffect(() => {
        if (!hasLoaded.current) {
            hasLoaded.current = true;
            loadData();
        }
    }, []);

    // Filterlogik (case-insensitive)
    const filteredEmployees = employees.filter((emp) => {
        const nameOk = searchTerm === "" ||
            emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.lastName.toLowerCase().includes(searchTerm.toLowerCase());

        const cityOk = cityFilter === "" ||
            emp.city.toLowerCase().includes(cityFilter.toLowerCase());

        // Alle ausgewählten Skills müssen vorhanden sein
        const skillOk = skillFilter.length === 0 ||
            skillFilter.every((id) => emp.skillSet?.some((s) => s.id === id));

        return nameOk && cityOk && skillOk;
    });

    const handleResetFilters = () => {
        setSearchTerm("");
        setCityFilter("");
        setSkillFilter([]);
    };

    // Löschen
    const handleDeleteClick = (emp: Employee) => {
        setEmployeeToDelete(emp);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!employeeToDelete?.id) return;
        setDeleteLoading(true);
        await deleteEmployee(employeeToDelete.id);
        setDeleteLoading(false);
        setShowDeleteModal(false);
        setFeedback({
            type: "success",
            message: `${employeeToDelete.firstName} ${employeeToDelete.lastName} wurde gelöscht.`
        });
        setEmployeeToDelete(null);
        // Neu laden nach Löschen
        loadData();
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setEmployeeToDelete(null);
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mitarbeiterübersicht</h1>
                <Link to="/employees/new">
                    <Button variant="primary">+ Neuer Mitarbeiter</Button>
                </Link>
            </div>

            {feedback && (
                <FeedbackAlert
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback(null)}
                />
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            <EmployeeFilter
                searchTerm={searchTerm}
                cityFilter={cityFilter}
                skillFilter={skillFilter}
                availableSkills={allQualifications}
                onSearchChange={setSearchTerm}
                onCityChange={setCityFilter}
                onSkillChange={setSkillFilter}
                onReset={handleResetFilters}
            />

            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border"/>
                </div>
            )}

            {!loading && (
                <div className="table-responsive shadow-sm p-3 mb-5 bg-white rounded">
                    <Table hover className="align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>Vorname</th>
                            <th>Nachname</th>
                            <th>Ort</th>
                            <th>Qualifikationen</th>
                            <th className="text-end">Aktionen</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredEmployees.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted py-4">
                                    {employees.length === 0
                                        ? "Keine Mitarbeiter vorhanden."
                                        : "Keine Treffer für diese Filter."}
                                </td>
                            </tr>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.firstName}</td>
                                    <td>{emp.lastName}</td>
                                    <td>{emp.city}</td>
                                    <td>
                                        {emp.skillSet?.map((s) => (
                                            <span key={s.id} className="badge bg-light text-dark me-1 border">
                                                    {s.skill}
                                                </span>
                                        ))}
                                    </td>
                                    <td className="text-end">
                                        <Link to={`/employees/${emp.id}`} className="me-2">
                                            <Button variant="outline-secondary" size="sm">Bearbeiten</Button>
                                        </Link>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick(emp)}
                                        >
                                            Löschen
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>

                    {employees.length > 0 && (
                        <div className="text-muted small mt-3">
                            {filteredEmployees.length} von {employees.length} angezeigt
                        </div>
                    )}
                </div>
            )}

            <ConfirmModal
                show={showDeleteModal}
                title="Mitarbeiter löschen"
                message={employeeToDelete
                    ? `Wirklich "${employeeToDelete.firstName} ${employeeToDelete.lastName}" löschen?`
                    : ""}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                loading={deleteLoading}
            />
        </Container>
    );
}
