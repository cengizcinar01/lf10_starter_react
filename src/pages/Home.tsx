import {useCallback, useEffect, useRef, useState} from "react";
import {Alert, Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {useAuth} from "react-oidc-context";

import {DashboardCard} from "../components/DashboardCard";
import {QuickActionsCard} from "../components/QuickActionsCard";
import {useEmployeeApi} from "../hooks/useEmployeeApi";
import {useQualificationApi} from "../hooks/useQualificationApi";

// Startseite mit Dashboard-Kacheln
export function Home() {
    const auth = useAuth();
    const {fetchEmployees} = useEmployeeApi();
    const {fetchQualifications} = useQualificationApi();

    const [employeeCount, setEmployeeCount] = useState<number | null>(null);
    const [qualificationCount, setQualificationCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasLoaded = useRef(false);

    const loadKPIs = useCallback(async () => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;

        setLoading(true);
        setError(null);
        try {
            const [employees, qualifications] = await Promise.all([fetchEmployees(), fetchQualifications()]);
            setEmployeeCount(employees?.length ?? 0);
            setQualificationCount(qualifications?.length ?? 0);
        } catch {
            setError("Fehler beim Laden der Daten");
        } finally {
            setLoading(false);
        }
    }, [fetchEmployees, fetchQualifications]);

    useEffect(() => {
        if (auth.isAuthenticated) loadKPIs();
    }, [auth.isAuthenticated, loadKPIs]);

    const quickActions = [
        {to: "/employees/new", label: "+ Neuer Mitarbeiter", variant: "primary"},
        {to: "/qualifications", label: "Qualifikationen pflegen", variant: "outline-secondary"}
    ];

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Willkommen im Employee Management System</h1>
            <p className="text-muted mb-4">HiTec GmbH - Backoffice</p>

            {!auth.isAuthenticated && (
                <div className="text-center py-5">
                    <p className="mb-4">Bitte melden Sie sich an, um auf die Mitarbeiterverwaltung zuzugreifen.</p>
                    <Button variant="primary" size="lg" onClick={() => auth.signinRedirect()}>
                        Jetzt anmelden
                    </Button>
                </div>
            )}

            {auth.isAuthenticated && (
                <>
                    {loading && (
                        <div className="text-center my-5">
                            <Spinner animation="border"/>
                            <p className="mt-2">Lade Daten...</p>
                        </div>
                    )}

                    {error && <Alert variant="danger">{error}</Alert>}

                    {!loading && !error && (
                        <Row className="g-4">
                            <Col md={6} lg={4}>
                                <DashboardCard title="Mitarbeiter" count={employeeCount} linkTo="/employees"
                                               linkText="Zur Übersicht" variant="primary"/>
                            </Col>
                            <Col md={6} lg={4}>
                                <DashboardCard title="Qualifikationen" count={qualificationCount}
                                               linkTo="/qualifications" linkText="Verwalten" variant="success"/>
                            </Col>
                            <Col md={12} lg={4}>
                                <QuickActionsCard actions={quickActions}/>
                            </Col>
                        </Row>
                    )}

                    <div className="mt-4 text-muted small">
                        Angemeldet
                        als: {auth.user?.profile?.preferred_username ?? auth.user?.profile?.email ?? "Unbekannt"}
                    </div>
                </>
            )}
        </Container>
    );
}
