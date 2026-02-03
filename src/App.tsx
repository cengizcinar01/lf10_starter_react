import './App.css'
import {Container} from "react-bootstrap";
import {Route, Routes} from "react-router-dom";

import {AuthCallback} from "./auth/AuthCallback.tsx";
import RequireAuth from "./auth/RequireAuth.tsx";
import {Navigation} from "./components/Navigation.tsx";
import {EmployeeEdit} from "./pages/EmployeeEdit.tsx";
import {EmployeeList} from "./pages/EmployeeList.tsx";
import {Home} from "./pages/Home.tsx";
import {QualificationList} from "./pages/QualificationList.tsx";

function App() {
    return (
        <>
            {/* Die Navigation ist immer sichtbar */}
            <Navigation/>

            <Container>
                <Routes>
                    {/* Öffentliche Seite */}
                    <Route path="/" element={<Home/>}/>

                    {/* OAuth Callback Route */}
                    <Route path="/callback" element={<AuthCallback/>}/>

                    {/* Die unteren Routen sind nur mit Login erreichbar */}

                    {/* Mitarbeiter Übersicht */}
                    <Route path="/employees" element={
                        <RequireAuth>
                            <EmployeeList/>
                        </RequireAuth>
                    }/>

                    {/* Mitarbeiter Anlegen */}
                    {/* WICHTIG: Diese Route MUSS vor /employees/:id definiert werden,
                        da sonst "new" als ID-Parameter interpretiert wird */}
                    <Route path="/employees/new" element={
                        <RequireAuth>
                            <EmployeeEdit/>
                        </RequireAuth>
                    }/>

                    {/* Mitarbeiter Bearbeiten */}
                    <Route path="/employees/:id" element={
                        <RequireAuth>
                            <EmployeeEdit/>
                        </RequireAuth>
                    }/>

                    {/* Qualifikationen */}
                    <Route path="/qualifications" element={
                        <RequireAuth>
                            <QualificationList/>
                        </RequireAuth>
                    }/>

                </Routes>
            </Container>
        </>
    )
}

export default App
