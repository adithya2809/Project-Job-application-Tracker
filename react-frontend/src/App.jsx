import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './login';
import Dashboard from './dashboard';
import ProtectedRoute from './protectedroute';

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;