import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

import type {Employee} from "../types";

interface EmployeeRowProps {
    employee: Employee;
    onDelete: (emp: Employee) => void;
}

// Einzelne Zeile in der Mitarbeiter-Tabelle
export function EmployeeRow({employee, onDelete}: EmployeeRowProps) {
    return (
        <tr>
            <td>{employee.firstName}</td>
            <td>{employee.lastName}</td>
            <td>{employee.city}</td>
            <td>
                {employee.skillSet?.map((s) => (
                    <span key={s.id} className="badge bg-light text-dark me-1 border">
                        {s.skill}
                    </span>
                ))}
            </td>
            <td className="text-end">
                <Link to={`/employees/${employee.id}`} className="me-2">
                    <Button variant="outline-secondary" size="sm">Bearbeiten</Button>
                </Link>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(employee)}
                >
                    Löschen
                </Button>
            </td>
        </tr>
    );
}
