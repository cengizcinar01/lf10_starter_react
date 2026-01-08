import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useAuth} from "react-oidc-context";

const NAVBAR_BRAND = process.env.REACT_APP_NAVBAR_BRAND || "HiTec Backoffice";

export function Navigation() {
    const auth = useAuth();

    return (
        <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">{NAVBAR_BRAND}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Startseite</Nav.Link>
                        {/* Diese Links sieht man nur, wenn man eingeloggt ist */}
                        {auth.isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to="/employees">Mitarbeiter</Nav.Link>
                                <Nav.Link as={Link} to="/qualifications">Qualifikationen</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {auth.isAuthenticated ? (
                            <Button variant="outline-danger" onClick={() => auth.signoutRedirect()}>Abmelden</Button>
                        ) : (
                            <Button variant="outline-primary" onClick={() => auth.signinRedirect()}>Anmelden</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}