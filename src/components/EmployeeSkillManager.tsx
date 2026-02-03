import {useState} from "react";
import {Badge, Button, Form, InputGroup, Spinner} from "react-bootstrap";

import type {Qualification} from "../types";

interface EmployeeSkillManagerProps {
    currentSkills: Qualification[];
    availableSkills: Qualification[];
    onAddSkill: (skillId: number) => void;
    onRemoveSkill: (skillId: number) => void;
    onCreateSkill?: (skillName: string) => void; // Optional: Neue Quali erstellen
    loading?: boolean;
}

// Zeigt die Skills eines Mitarbeiters und erlaubt Hinzufügen/Entfernen
export function EmployeeSkillManager({
                                         currentSkills,
                                         availableSkills,
                                         onAddSkill,
                                         onRemoveSkill,
                                         onCreateSkill,
                                         loading = false,
                                     }: EmployeeSkillManagerProps) {
    const [selectedSkillId, setSelectedSkillId] = useState<string>("");
    const [newSkillName, setNewSkillName] = useState<string>("");

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

    const handleCreate = () => {
        if (newSkillName.trim() && onCreateSkill) {
            onCreateSkill(newSkillName.trim());
            setNewSkillName("");
        }
    };

    return (
        <div className="border rounded p-3 bg-light">
            <h5 className="mb-3">Qualifikationen</h5>

            {/* Zugewiesene Skills als Badges */}
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

            {/* Vorhandenen Skill auswählen */}
            {selectableSkills.length > 0 && (
                <InputGroup className="mb-3">
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
            )}

            {/* Neuen Skill erstellen (nur wenn onCreateSkill vorhanden) */}
            {onCreateSkill && (
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Neuen Skill erstellen..."
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        variant="outline-primary"
                        onClick={handleCreate}
                        disabled={!newSkillName.trim() || loading}
                    >
                        Erstellen
                    </Button>
                </InputGroup>
            )}

            {selectableSkills.length === 0 && !onCreateSkill && (
                <p className="text-muted small mb-0">
                    {availableSkills.length === 0
                        ? "Keine Skills im System."
                        : "Alle verfügbaren Skills wurden schon zugewiesen."}
                </p>
            )}
        </div>
    );
}

