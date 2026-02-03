import {useEffect, useRef, useState} from "react";
import {Alert, Button, Container, Spinner, Table} from "react-bootstrap";
import {Link} from "react-router-dom";

import {ConfirmModal} from "../components/ConfirmModal";
import {EmployeeFilter} from "../components/EmployeeFilter";
import {EmployeeRow} from "../components/EmployeeRow";
import {EmptyState} from "../components/EmptyState";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [skillFilter, setSkillFilter] = useState<number[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    const hasLoaded = useRef(false);

    const loadData = async () => {
        const [empData, qualData] = await Promise.all([fetchEmployees(), fetchQualifications()]);
        if (empData) setEmployees(empData);
        if (qualData) setAllQualifications(qualData);
    };

     
    useEffect(() => {
        if (!hasLoaded.current) {
            hasLoaded.current = true;
            loadData();
        }
    }, []);

    const filteredEmployees = employees.filter((emp) => {
        const nameOk = !searchTerm || emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || emp.lastName.toLowerCase().includes(searchTerm.toLowerCase());
        const cityOk = !cityFilter || emp.city.toLowerCase().includes(cityFilter.toLowerCase());
        const skillOk = !skillFilter.length || skillFilter.every((id) => emp.skillSet?.some((s) => s.id === id));
        return nameOk && cityOk && skillOk;
    });

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
        setFeedback({type: "success", message: `${employeeToDelete.firstName} ${employeeToDelete.lastName} wurde gelöscht.`});
        setEmployeeToDelete(null);
        loadData();
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mitarbeiterübersicht</h1>
                <Link to="/employees/new"><Button variant="primary">+ Neuer Mitarbeiter</Button></Link>
            </div>

            {feedback && <FeedbackAlert type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} />}
            {error && <Alert variant="danger">{error}</Alert>}

            <EmployeeFilter
                searchTerm={searchTerm} cityFilter={cityFilter} skillFilter={skillFilter}
                availableSkills={allQualifications}
                onSearchChange={setSearchTerm} onCityChange={setCityFilter} onSkillChange={setSkillFilter}
                onReset={() => { setSearchTerm(""); setCityFilter(""); setSkillFilter([]); }}
            />

            {loading && <div className="text-center my-5"><Spinner animation="border" /></div>}

            {!loading && (
                <div className="table-responsive shadow-sm p-3 mb-5 bg-white rounded">
                    <Table hover className="align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Vorname</th><th>Nachname</th><th>Ort</th><th>Qualifikationen</th><th className="text-end">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.length === 0
                                ? <EmptyState colSpan={5} message={employees.length === 0 ? "Keine Mitarbeiter vorhanden." : "Keine Treffer."} />
                                : filteredEmployees.map((emp) => <EmployeeRow key={emp.id} employee={emp} onDelete={handleDeleteClick} />)
                            }
                        </tbody>
                    </Table>
                    {employees.length > 0 && <div className="text-muted small mt-3">{filteredEmployees.length} von {employees.length} angezeigt</div>}
                </div>
            )}

            <ConfirmModal
                show={showDeleteModal} title="Mitarbeiter löschen"
                message={employeeToDelete ? `Wirklich "${employeeToDelete.firstName} ${employeeToDelete.lastName}" löschen?` : ""}
                onConfirm={handleDeleteConfirm} onCancel={() => { setShowDeleteModal(false); setEmployeeToDelete(null); }}
                loading={deleteLoading}
            />
        </Container>
    );
}
