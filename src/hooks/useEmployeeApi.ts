import {useState} from "react";
import {useAuth} from "react-oidc-context";

import {API_BASE_URL} from "../config";
import type {Employee} from "../types";

export function useEmployeeApi() {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    const headers: Record<string, string> = {'Content-Type': 'application/json'};
    if (auth.user?.access_token) {
      headers['Authorization'] = `Bearer ${auth.user.access_token}`;
    }
    return headers;
  };

  // Generische API-Funktion um Duplikation zu vermeiden
  const apiCall = async <T>(
    url: string,
    options: RequestInit = {},
    errorMsg: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {headers: getHeaders(), ...options});
      if (!response.ok) {
        setError(errorMsg);
        return null;
      }
      // Bei DELETE kommt oft kein Body zurück
      if (response.status === 204 || options.method === 'DELETE') {
        return true as T;
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = () =>
    apiCall<Employee[]>(`${API_BASE_URL}/employees`, {}, "Fehler beim Laden");

  const getEmployeeById = (id: number) =>
    apiCall<Employee>(`${API_BASE_URL}/employees/${id}`, {}, "Fehler beim Laden");

  const createEmployee = (employee: Employee) =>
    apiCall<Employee>(`${API_BASE_URL}/employees`, {
      method: 'POST',
      body: JSON.stringify(employee)
    }, "Fehler beim Erstellen");

  const updateEmployee = (id: number, employee: Employee) =>
    apiCall<Employee>(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee)
    }, "Fehler beim Aktualisieren");

  const deleteEmployee = (id: number) =>
    apiCall<boolean>(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE'
    }, "Fehler beim Löschen");

  const addSkillToEmployee = (employeeId: number, skill: string) =>
    apiCall<Employee>(`${API_BASE_URL}/employees/${employeeId}/qualifications`, {
      method: 'POST',
      body: JSON.stringify({skill})
    }, "Fehler beim Hinzufügen");

  const removeSkillFromEmployee = (employeeId: number, qualificationId: number) =>
    apiCall<boolean>(`${API_BASE_URL}/employees/${employeeId}/qualifications/${qualificationId}`, {
      method: 'DELETE'
    }, "Fehler beim Entfernen");

  return {
    fetchEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    addSkillToEmployee,
    removeSkillFromEmployee,
    loading,
    error
  };
}
