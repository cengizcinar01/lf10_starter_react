import {useState} from "react";
import {useAuth} from "react-oidc-context";

import type {Employee} from "../types";

export function useEmployeeApi() {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (auth.user?.access_token) {
      headers['Authorization'] = `Bearer ${auth.user.access_token}`;
    }
    return headers;
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8089/employees', {headers: getHeaders()});
      if (!response.ok) {
        setError("Fehler beim Laden der Mitarbeiter");
        return null;
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8089/employees/${id}`, {headers: getHeaders()});
      if (!response.ok) {
        setError("Fehler beim Laden des Mitarbeiters");
        return null;
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employee: Employee) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8089/employees', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(employee)
      });
      if (!response.ok) {
        setError("Fehler beim Erstellen des Mitarbeiters");
        return null;
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: number, employee: Employee) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8089/employees/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(employee)
      });
      if (!response.ok) {
        setError("Fehler beim Aktualisieren des Mitarbeiters");
        return null;
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8089/employees/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) {
        setError("Fehler beim Löschen des Mitarbeiters");
        return false;
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Skill einem Mitarbeiter zuweisen (POST /employees/:id/qualifications mit Body)
  const addSkillToEmployee = async (employeeId: number, qualificationId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8089/employees/${employeeId}/qualifications`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({id: qualificationId})
        }
      );
      if (!response.ok) {
        setError("Fehler beim Hinzufügen der Qualifikation");
        return null;
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Skill von einem Mitarbeiter entfernen
  const removeSkillFromEmployee = async (employeeId: number, qualificationId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8089/employees/${employeeId}/qualifications/${qualificationId}`,
        {
          method: 'DELETE',
          headers: getHeaders()
        }
      );
      if (!response.ok) {
        setError("Fehler beim Entfernen der Qualifikation");
        return false;
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      return false;
    } finally {
      setLoading(false);
    }
  };

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
