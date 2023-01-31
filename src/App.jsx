import Accounts from 'myoasis-accounts';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Loading from './components/loading/Loading';
import { auth } from './fb.user';
import Default from './layouts/default/Default';
import Editor from './pages/editor/Editor';
import Player from './pages/player/Player';


function App() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (error) console.error(error);
    }, [error, user]);
    return (
        <>
            {!loading && <Routes>
                <Route path="/code/:codeid/*" element={<Editor user={user} />} />
                <Route path="/play/:playid/*" element={<Player user={user} />} />
                <Route path="/accounts/*" element={<Accounts onUserChange={() => navigate(-1)} />} />
                <Route path="/*" element={<Default user={user} />} />
            </Routes>}
            {loading && <Loading />}
        </>
    );
};

export default App;