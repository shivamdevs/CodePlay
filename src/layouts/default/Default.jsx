import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import Code from '../../pages/code/Code';
import Home from '../../pages/home/Home';
import Play from '../../pages/play/Play';
import Profile from '../../pages/profile/Profile';

function Default({ user = null }) {
    return (
        <>
            <Header user={user} />
            <main className="main">
                <Routes>
                    <Route path="/play" element={<Play user={user} />} />
                    <Route path="/code" element={<Code user={user} />} />
                    <Route path="/cp" exact element={<Navigate to={user ? `/cp/${user.uid}` : "/"} replace />} />
                    <Route path="/cp/:coderid" element={<Profile user={user} />} />
                    <Route exact path="/" element={<Home user={user} />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
};

export default Default;