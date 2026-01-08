import {useAuth} from "react-oidc-context";
import type {JSX} from "react";
import {useEffect} from "react";

export default function RequireAuth({children}: { children: JSX.Element }) {
    const auth = useAuth();

    useEffect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            auth.signinRedirect();
        }
    }, [auth.isLoading, auth.isAuthenticated]);

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