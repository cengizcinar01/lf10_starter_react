import {Button, ListGroup} from "react-bootstrap";

import type {Qualification} from "../types";

interface QualificationRowProps {
    qualification: Qualification;
    onDelete: (q: Qualification) => void;
    disabled?: boolean;
}

// Einzelner Eintrag in der Qualifikations-Liste
export function QualificationRow({qualification, onDelete, disabled = false}: QualificationRowProps) {
    return (
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>{qualification.skill}</span>
            <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(qualification)}
                disabled={disabled}
            >
                Löschen
            </Button>
        </ListGroup.Item>
    );
}
