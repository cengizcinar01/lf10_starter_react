import {useCallback, useState} from "react";
import {useAuth} from "react-oidc-context";

import {API_BASE_URL} from "../config";
import type {Qualification} from "../types";

export function useQualificationApi() {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {'Content-Type': 'application/json'};
    if (auth.user?.access_token) {
      headers['Authorization'] = `Bearer ${auth.user.access_token}`;
    }
    return headers;
  }, [auth.user?.access_token]);

  const fetchQualifications = useCallback(async (): Promise<Qualification[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/qualifications`, {headers: getHeaders()});
      if (!response.ok) {
        setError("Fehler beim Laden");
        return [];
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const createQualification = useCallback(async (skill: string): Promise<Qualification | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/qualifications`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({skill})
      });
      if (!response.ok) {
        setError("Fehler beim Erstellen");
        return null;
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const deleteQualification = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/qualifications/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) {
        setError("Fehler beim Löschen");
        return false;
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  return {fetchQualifications, createQualification, deleteQualification, loading, error};
}
