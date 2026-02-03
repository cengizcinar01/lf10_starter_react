import {useState} from "react";
import {Badge, Button, Form, InputGroup, Spinner} from "react-bootstrap";

import type {Qualification} from "../types";

interface EmployeeSkillManagerProps {
    currentSkills: Qualification[];
    availableSkills: Qualification[];
    onAddSkill: (skillId: number) => void;
    onRemoveSkill: (skillId: number) => void;
    loading?: boolean;
}

// Zeigt die Skills eines Mitarbeiters und erlaubt Hinzufügen/Entfernen
export function EmployeeSkillManager({
                                         currentSkills,
                                         availableSkills,
                                         onAddSkill,
                                         onRemoveSkill,
                                         loading = false,
                                     }: EmployeeSkillManagerProps) {
    const [selectedSkillId, setSelectedSkillId] = useState<string>("");

    // Nur Skills zeigen die noch nicht zugewiesen sind
    const selectableSkills = availableSkills.filter(
        (skill) => !currentSkills.some((cs) => cs.id === skill.id)
    );

    const handleAdd = () => {
        if (selectedSkillId) {
            onAddSkill(Number(selectedSkillId));
            setSelectedSkillId("");
        }
    };

    return (
        <div className="border rounded p-3 bg-light">
            <h5 className="mb-3">Qualifikationen</h5>

            <div className="mb-3">
                {currentSkills.length === 0 ? (
                    <p className="text-muted mb-0">Noch keine Skills zugewiesen.</p>
                ) : (
                    <div className="d-flex flex-wrap gap-2">
                        {currentSkills.map((skill) => (
                            <Badge
                                key={skill.id}
                                bg="primary"
                                className="d-flex align-items-center gap-2 py-2 px-3"
                            >
                                {skill.skill}
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 text-white"
                                    onClick={() => onRemoveSkill(skill.id!)}
                                    disabled={loading}
                                    title="Entfernen"
                                >
                                    ×
                                </Button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {selectableSkills.length > 0 ? (
                <InputGroup>
                    <Form.Select
                        value={selectedSkillId}
                        onChange={(e) => setSelectedSkillId(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Skill auswählen...</option>
                        {selectableSkills.map((skill) => (
                            <option key={skill.id} value={skill.id}>
                                {skill.skill}
                            </option>
                        ))}
                    </Form.Select>
                    <Button
                        variant="success"
                        onClick={handleAdd}
                        disabled={!selectedSkillId || loading}
                    >
                        {loading ? <Spinner size="sm"/> : "Hinzufügen"}
                    </Button>
                </InputGroup>
            ) : (
                <p className="text-muted small mb-0">
                    {availableSkills.length === 0
                        ? "Keine Skills im System."
                        : "Alle verfügbaren Skills wurden schon zugewiesen."}
                </p>
            )}
        </div>
    );
}
