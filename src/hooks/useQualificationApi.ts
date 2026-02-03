import {useCallback, useState} from "react";
import {useAuth} from "react-oidc-context";

import type {Qualification} from "../types";

// Hook für alle API-Calls zu /qualifications
export function useQualificationApi() {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'http://localhost:8089/qualifications';

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (auth.user?.access_token) {
      headers['Authorization'] = `Bearer ${auth.user.access_token}`;
    }
    return headers;
  }, [auth.user?.access_token]);

  const fetchQualifications = useCallback(async (): Promise<Qualification[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(baseUrl, {headers: getHeaders()});
      if (!response.ok) {
        setError("Fehler beim Laden der Qualifikationen");
        return [];
      }
      return await response.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const createQualification = useCallback(async (skill: string): Promise<Qualification | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({skill})
      });
      if (!response.ok) {
        setError("Fehler beim Erstellen der Qualifikation");
        return null;
      }
      return await response.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const deleteQualification = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) {
        setError("Fehler beim Löschen der Qualifikation");
        return false;
      }
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  return {fetchQualifications, createQualification, deleteQualification, loading, error};
}
