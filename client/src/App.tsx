import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NoMatch from './pages/NoMatchPage';
import Layout from './components/main/Layout';
import Protected from './components/main/Protected';
import Friend from './pages/Friend';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="/"
                        element={
                            <Protected>
                                <Home />
                            </Protected>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <Protected>
                                <Profile />
                            </Protected>
                        }
                    />
                    <Route path="/:id" element={<Friend />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
