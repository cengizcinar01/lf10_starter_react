import type {JSX} from "react";
import {useEffect} from "react";
import {useAuth} from "react-oidc-context";

export default function RequireAuth({children}: { children: JSX.Element }) {
    const auth = useAuth();

    // Wenn nicht eingeloggt -> automatisch zum SSO weiterleiten
    useEffect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            auth.signinRedirect();
        }
    }, [auth]);

    if (auth.isLoading) {
        return <p>Lädt...</p>;
    }

    if (auth.error) {
        return <p>Fehler: {auth.error.message}</p>;
    }

    if (auth.isAuthenticated) {
        return children;
    }
    return <p>Weiterleitung zum Login...</p>;
}