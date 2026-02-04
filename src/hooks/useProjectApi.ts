import { useCallback, useState, useEffect } from "react";
import type { Project } from "../types";

export function useProjectApi() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const [projects, setProjects] = useState<Project[]>(() => {
        const saved = localStorage.getItem("hitec_projects");
        return saved ? JSON.parse(saved) : [
           { 
        id: 1, 
        name: "Kunden App SmartHome", 
        description: "App Steuerung für alle Smart Geräte." 
    },
    { 
        id: 2, 
        name: "Onlineshop Redesign", 
        description: "Neues Layout und verbesserte aussehen." 
    },  
    { 
        id: 3, 
        name: "Mitarbeiter Schulung IT", 
        description: "Kurse für neue Software-Tools." 
    }
        ];
    });
    // Hilfsfunktion: Speichert den aktuellen Stand in den LocalStorage
    useEffect(() => {
        localStorage.setItem("hitec_projects", JSON.stringify(projects));
    }, [projects]);

    // Alle Projekte laden
    const fetchProjects = useCallback(async () => {
        setLoading(true);
        // Kurzer Fake-Delay für die Optik
        await new Promise(resolve => setTimeout(resolve, 300));
        setLoading(false);
        return projects;
    }, [projects]);

    // Projekt erstellen
    const createProject = useCallback(async (name: string, description: string) => {
        setLoading(true);
        const newProject: Project = { 
            id: Date.now(), 
            name, 
            description 
        };
        setProjects((prev) => [...prev, newProject]);
        setLoading(false);
        return newProject;
    }, []);

    // Projekt löschen
    const deleteProject = useCallback(async (id: number) => {
        setLoading(true);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setLoading(false);
        return true;
    }, []);

    // Alle löschen
    const clearAllProjects = useCallback(async () => {
        setProjects([]);
        return true;
    }, []);

    return {projects, fetchProjects, createProject, deleteProject, clearAllProjects, loading, error};
}