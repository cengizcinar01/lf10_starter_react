import {Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";

interface QuickActionsCardProps {
    actions: { to: string; label: string; variant: string }[];
}

// Schnellzugriff-Karte für das Dashboard
export function QuickActionsCard({actions}: QuickActionsCardProps) {
    return (
        <Card className="h-100 shadow-sm">
            <Card.Body>
                <Card.Title className="text-muted">Schnellzugriff</Card.Title>
                <div className="d-grid gap-2 mt-3">
                    {actions.map((action, index) => (
                        <Link key={index} to={action.to}>
                            <Button variant={action.variant} className="w-100">
                                {action.label}
                            </Button>
                        </Link>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
}
