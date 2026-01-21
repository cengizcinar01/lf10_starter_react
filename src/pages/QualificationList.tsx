import {useEffect, useState} from "react";
import {Alert, Container, ListGroup, Spinner} from "react-bootstrap";
import {useQualificationApi} from "../hooks/useQualificationApi";
import type {Qualification} from "../types";

export function QualificationList() {
    const {getAllQualifications, loading, error} = useQualificationApi();
    const [qualifications, setQualifications] = useState<Qualification[]>([]);

    useEffect(() => {
        const loadQualis = async () => {
            const data = await getAllQualifications();
            if (data) {
                setQualifications(data);
            }
        };
        loadQualis();
    }, []);

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Qualifikations-Verwaltung</h1>

            {loading && <div className="text-center my-5"><Spinner animation="border"/></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <div className="shadow-sm p-3 mb-5 bg-white rounded">
                    <ListGroup>
                        {qualifications.map((q) => (
                            <ListGroup.Item key={q.id}>
                                {q.skill}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    {qualifications.length === 0 && <p className="text-muted mt-3">Keine Qualifikationen gefunden.</p>}
                </div>
            )}
        </Container>
    );
}