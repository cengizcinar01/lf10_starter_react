import { useAuth } from "react-oidc-context";
import { useState, useCallback } from "react";
import type { Qualification } from "../types";

export function useQualificationApi() {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = 'http://localhost:8089/qualifications';

    const getHeaders = () => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (auth.user?.access_token) {
            headers['Authorization'] = `Bearer ${auth.user.access_token}`;
        }
        return headers;
    };

    // Alle Qualifikationen laden
    const fetchQualifications = useCallback(async (): Promise<Qualification[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(baseUrl, { headers: getHeaders() });
            if (!response.ok) throw new Error("Fehler beim Laden der Qualifikationen");
            return await response.json();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
            setError(msg);
            return [];
        } finally {
            setLoading(false);
        }
    }, [auth.user?.access_token]);

    // Neue Qualifikation erstellen (POST)
    const createQualification = async (skill: string): Promise<Qualification | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ skill })
            });
            if (!response.ok) throw new Error("Fehler beim Erstellen der Qualifikation");
            return await response.json();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Qualifikation löschen (DELETE)
    const deleteQualification = async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (!response.ok) throw new Error("Fehler beim Löschen der Qualifikation");
            return true;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { fetchQualifications, createQualification, deleteQualification, loading, error };
}
