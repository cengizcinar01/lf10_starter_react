import {useAuth} from "react-oidc-context";
import {useState} from "react";
import type {Employee} from "../types";

export function useEmployeeApi() {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            if (auth.user?.access_token) {
                headers['Authorization'] = `Bearer ${auth.user.access_token}`;
            }

            const response = await fetch('http://localhost:8089/employees', {headers});
            if (!response.ok) {
                setError("Fehler beim Laden der Mitarbeiter");
            }
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
        } finally {
            setLoading(false);
        }
    };

    const addQualificationToEmployee = async (
    employeeId: number,
    qualificationId: number
    ) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (auth.user?.access_token) {
        headers['Authorization'] = `Bearer ${auth.user.access_token}`;
    }

    const response = await fetch(
        `http://localhost:8089/employees/${employeeId}/qualifications/${qualificationId}`,
        {
            method: 'POST',
            headers
        }
    );

    if (!response.ok) {
        throw new Error("Skill konnte nicht zugewiesen werden");
    }
};

    const getEmployeeById = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            if (auth.user?.access_token) {
                headers['Authorization'] = `Bearer ${auth.user.access_token}`;
            }

            const response = await fetch(`http://localhost:8089/employees/${id}`, {headers});
            if (!response.ok) {
                throw new Error("Fehler beim Laden des Mitarbeiters");
            }
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
        } finally {
            setLoading(false);
        }
    };

    const createEmployee = async (employee: Employee) => {
        setLoading(true);
        setError(null);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            if (auth.user?.access_token) {
                headers['Authorization'] = `Bearer ${auth.user.access_token}`;
            }

            const response = await fetch('http://localhost:8089/employees', {
                method: 'POST',
                headers,
                body: JSON.stringify(employee)
            });

            if (!response.ok) {
                throw new Error("Fehler beim Erstellen des Mitarbeiters");
            }
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
        } finally {
            setLoading(false);
        }
    };

    const updateEmployee = async (id: number, employee: Employee) => {
        setLoading(true);
        setError(null);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            if (auth.user?.access_token) {
                headers['Authorization'] = `Bearer ${auth.user.access_token}`;
            }

            const response = await fetch(`http://localhost:8089/employees/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(employee)
            });

            if (!response.ok) {
                throw new Error("Fehler beim Aktualisieren des Mitarbeiters");
            }
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            if (auth.user?.access_token) {
                headers['Authorization'] = `Bearer ${auth.user.access_token}`;
            }

            const response = await fetch(`http://localhost:8089/employees/${id}`, {
                method: 'DELETE',
                headers
            });

            if (!response.ok) {
                throw new Error("Fehler beim Löschen des Mitarbeiters");
            }
            // DELETE often returns empty body, so no .json() call if 204
            if (response.status !== 204) {
                return await response.json();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
        } finally {
            setLoading(false);
        }
    };

    return {fetchEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee,  addQualificationToEmployee, loading, error};
}