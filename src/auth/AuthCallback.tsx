import {useEffect} from "react";
import {Spinner} from "react-bootstrap";
import {useAuth} from "react-oidc-context";
import {useNavigate} from "react-router-dom";

// Verarbeitet den OAuth Callback nach dem Login
export function AuthCallback() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Warten bis Auth fertig geladen hat
        if (!auth.isLoading) {
            if (auth.isAuthenticated) {
                navigate("/", {replace: true});
            } else if (auth.error) {
                console.error("Auth error:", auth.error);
                navigate("/", {replace: true});
            }
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.error, navigate]);

    return (
        <div className="text-center mt-5">
            <Spinner animation="border"/>
            <p className="mt-2">Anmeldung wird verarbeitet...</p>
        </div>
    );
}
