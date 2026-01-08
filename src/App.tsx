import './App.css'
import {Route, Routes} from "react-router-dom";
import {Container} from "react-bootstrap";

import {Navigation} from "./components/Navigation.tsx";
import {Home} from "./pages/Home.tsx";
import {EmployeeList} from "./pages/EmployeeList.tsx";
import {EmployeeEdit} from "./pages/EmployeeEdit.tsx";
import {QualiList} from "./pages/QualiList.tsx";
import RequireAuth from "./auth/RequireAuth.tsx";

function App() {
    return (
        <>
            {/* Die Navigation ist immer sichtbar */}
            <Navigation/>

            <Container>
                <Routes>
                    {/* Öffentliche Seite */}
                    <Route path="/" element={<Home/>}/>

                    {/* Die unteren Routen sind nur mit Login erreichbar */}

                    {/* 1. Mitarbeiter Übersicht */}
                    <Route path="/employees" element={
                        <RequireAuth>
                            <EmployeeList/>
                        </RequireAuth>
                    }/>

                    {/* 2. Mitarbeiter Anlegen (Neu) */}
                    {/* WICHTIG: Diese Route MUSS vor /employees/:id definiert werden,
                        da sonst "new" als ID-Parameter interpretiert wird */}
                    <Route path="/employees/new" element={
                        <RequireAuth>
                            <EmployeeEdit/>
                        </RequireAuth>
                    }/>

                    {/* 3. Mitarbeiter Bearbeiten (mit ID) */}
                    <Route path="/employees/:id" element={
                        <RequireAuth>
                            <EmployeeEdit/>
                        </RequireAuth>
                    }/>

                    {/* 4. Qualifikationen */}
                    <Route path="/qualifications" element={
                        <RequireAuth>
                            <QualiList/>
                        </RequireAuth>
                    }/>

                </Routes>
            </Container>
        </>
    )
}

export default App