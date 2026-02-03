import {useCallback, useEffect, useRef, useState} from "react";
import {Alert, Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";
import {useAuth} from "react-oidc-context";
import {Link} from "react-router-dom";

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

    // Ref um doppeltes Laden zu verhindern
    const hasLoaded = useRef(false);

    // Daten vom Backend holen
    const loadKPIs = useCallback(async () => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;

        setLoading(true);
        setError(null);
        try {
            const [employees, qualifications] = await Promise.all([
                fetchEmployees(),
                fetchQualifications()
            ]);
            setEmployeeCount(employees?.length ?? 0);
            setQualificationCount(qualifications?.length ?? 0);
        } catch {
            setError("Fehler beim Laden der Daten");
        } finally {
            setLoading(false);
        }
    }, [fetchEmployees, fetchQualifications]);

    // Beim Login KPIs laden
    useEffect(() => {
        if (auth.isAuthenticated) {
            loadKPIs();
        }
    }, [auth.isAuthenticated, loadKPIs]);

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Willkommen im Employee Management System</h1>
            <p className="text-muted mb-4">HiTec GmbH - Backoffice</p>

            {/* Nicht eingeloggt */}
            {!auth.isAuthenticated && (
                <div className="text-center py-5">
                    <p className="mb-4">
                        Bitte melden Sie sich an, um auf die Mitarbeiterverwaltung zuzugreifen.
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => auth.signinRedirect()}
                    >
                        Jetzt anmelden
                    </Button>
                </div>
            )}

            {/* Dashboard für eingeloggte User */}
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
                                <Card className="h-100 shadow-sm">
                                    <Card.Body className="text-center">
                                        <Card.Title className="text-muted">Mitarbeiter</Card.Title>
                                        <p className="display-4 fw-bold text-primary">
                                            {employeeCount ?? "-"}
                                        </p>
                                        <Link to="/employees">
                                            <Button variant="outline-primary" size="sm">
                                                Zur Übersicht
                                            </Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={6} lg={4}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Body className="text-center">
                                        <Card.Title className="text-muted">Qualifikationen</Card.Title>
                                        <p className="display-4 fw-bold text-success">
                                            {qualificationCount ?? "-"}
                                        </p>
                                        <Link to="/qualifications">
                                            <Button variant="outline-success" size="sm">
                                                Verwalten
                                            </Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={12} lg={4}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Body>
                                        <Card.Title className="text-muted">Schnellzugriff</Card.Title>
                                        <div className="d-grid gap-2 mt-3">
                                            <Link to="/employees/new">
                                                <Button variant="primary" className="w-100">
                                                    + Neuer Mitarbeiter
                                                </Button>
                                            </Link>
                                            <Link to="/qualifications">
                                                <Button variant="outline-secondary" className="w-100">
                                                    Qualifikationen pflegen
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card.Body>
                                </Card>
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
