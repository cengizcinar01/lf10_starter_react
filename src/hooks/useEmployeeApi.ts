import {useAuth} from "react-oidc-context";
import {useState} from "react";

// Define the Employee interface
export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    street: string;
    postcode: string;
    city: string;
    phone: string;
}

// Custom hook to interact with the Employee API
export function useEmployeeApi() {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch employees from the API
    const getAllEmployees = async (): Promise<Employee[]> => {
        setLoading(true);
        setError(null);

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            // Authentifizierung: Token an den Server mitsenden
            if (auth.user?.access_token) {
                headers['Authorization'] = `Bearer ${auth.user.access_token}`;
            }

            const response = await fetch('http://localhost:8089/employees', {headers});

            if (!response.ok) {
                
                throw new Error(`Fehler beim Laden: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Akzeptanzkriterium: Daten in der Konsole ausgeben
            console.log("Mitarbeiter erfolgreich abgerufen:", data);
            
            return data;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten';
            setError(msg);
            // Damit die App bei Fehlern nicht abstürzt
            return []; 
        } finally {
            setLoading(false);
        }
    };

   return { getAllEmployees, loading, error };
}