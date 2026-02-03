import {Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";

interface DashboardCardProps {
    title: string;
    count: number | null;
    linkTo: string;
    linkText: string;
    variant: "primary" | "success" | "secondary";
}

// Kachel für das Dashboard mit KPI-Anzeige
export function DashboardCard({title, count, linkTo, linkText, variant}: DashboardCardProps) {
    return (
        <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
                <Card.Title className="text-muted">{title}</Card.Title>
                <p className={`display-4 fw-bold text-${variant}`}>
                    {count ?? "-"}
                </p>
                <Link to={linkTo}>
                    <Button variant={`outline-${variant}`} size="sm">
                        {linkText}
                    </Button>
                </Link>
            </Card.Body>
        </Card>
    );
}
