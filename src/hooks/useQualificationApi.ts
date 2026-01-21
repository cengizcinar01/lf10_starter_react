import {useAuth} from "react-oidc-context";
import {useState} from "react";
import type {Qualification} from "../types";

export function useQualificationApi() {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllQualifications = async (): Promise<Qualification[] | undefined> => {
        setLoading(true);
        setError(null);

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            if (auth.user?.access_token) {
                headers['Authorization'] = `Bearer ${auth.user.access_token}`;
            }

            const response = await fetch('http://localhost:8089/qualifications', {headers});
            if (!response.ok) {
                throw new Error("Fehler beim Laden der Qualifikationen");
            }
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
        } finally {
            setLoading(false);
        }
    };

    return {getAllQualifications, loading, error};
}
