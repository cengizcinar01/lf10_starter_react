import {Badge, Button, Col, Form, Row} from "react-bootstrap";

import type {Qualification} from "../types";

interface EmployeeFilterProps {
    searchTerm: string;
    cityFilter: string;
    skillFilter: number[];
    availableSkills: Qualification[];
    onSearchChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onSkillChange: (skillIds: number[]) => void;
    onReset: () => void;
}

// Filterleiste über der Mitarbeiter-Tabelle
export function EmployeeFilter({
                                   searchTerm,
                                   cityFilter,
                                   skillFilter,
                                   availableSkills,
                                   onSearchChange,
                                   onCityChange,
                                   onSkillChange,
                                   onReset,
                               }: EmployeeFilterProps) {

    const handleSkillToggle = (skillId: number) => {
        if (skillFilter.includes(skillId)) {
            onSkillChange(skillFilter.filter((id) => id !== skillId));
        } else {
            onSkillChange([...skillFilter, skillId]);
        }
    };

    const hasActiveFilters = searchTerm !== "" || cityFilter !== "" || skillFilter.length > 0;

    return (
        <div className="bg-light p-3 rounded mb-4">
            <Row className="g-3 align-items-end">
                <Col md={4}>
                    <Form.Group controlId="searchName">
                        <Form.Label>Suche (Name)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Vor- oder Nachname..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </Form.Group>
                </Col>

                <Col md={3}>
                    <Form.Group controlId="filterCity">
                        <Form.Label>Ort</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="z.B. Berlin"
                            value={cityFilter}
                            onChange={(e) => onCityChange(e.target.value)}
                        />
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <Button
                        variant="outline-secondary"
                        onClick={onReset}
                        disabled={!hasActiveFilters}
                        className="w-100"
                    >
                        Zurücksetzen
                    </Button>
                </Col>
            </Row>

            {/* Skills als klickbare Badges */}
            {availableSkills.length > 0 && (
                <div className="mt-3">
                    <Form.Label className="d-block mb-2">Nach Skills filtern:</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                        {availableSkills.map((skill) => {
                            const isSelected = skillFilter.includes(skill.id!);
                            return (
                                <Badge
                                    key={skill.id}
                                    bg={isSelected ? "primary" : "secondary"}
                                    className="py-2 px-3"
                                    style={{cursor: "pointer", fontSize: "0.9rem"}}
                                    onClick={() => handleSkillToggle(skill.id!)}
                                >
                                    {isSelected && "✓ "}
                                    {skill.skill}
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
