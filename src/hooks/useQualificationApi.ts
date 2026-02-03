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

  // Generische API-Funktion um Duplikation zu vermeiden
  const apiCall = useCallback(async <T>(
    url: string,
    options: RequestInit = {},
    errorMsg: string,
    defaultValue: T
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {headers: getHeaders(), ...options});
      if (!response.ok) {
        setError(errorMsg);
        return defaultValue;
      }
      // Bei DELETE kommt oft kein Body zurück
      if (response.status === 204 || options.method === 'DELETE') {
        return true as T;
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      return defaultValue;
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  // Alle Qualifikationen laden
  const fetchQualifications = useCallback(() =>
      apiCall<Qualification[]>(`${API_BASE_URL}/qualifications`, {}, "Fehler beim Laden", []),
    [apiCall]);

  // Neue Qualifikation erstellen
  const createQualification = useCallback((skill: string) =>
      apiCall<Qualification | null>(`${API_BASE_URL}/qualifications`, {
        method: 'POST',
        body: JSON.stringify({skill})
      }, "Fehler beim Erstellen", null),
    [apiCall]);

  // Qualifikation löschen
  const deleteQualification = useCallback((id: number) =>
      apiCall<boolean>(`${API_BASE_URL}/qualifications/${id}`, {
        method: 'DELETE'
      }, "Fehler beim Löschen", false),
    [apiCall]);

  return {fetchQualifications, createQualification, deleteQualification, loading, error};
}
