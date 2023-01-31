import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import Code from '../../pages/code/Code';
import Home from '../../pages/home/Home';
import Play from '../../pages/play/Play';

function Default({ user = null }) {
    return (
        <>
            <Header user={user} />
            <main className="main">
                <Routes>
                    <Route path="/play" element={<Play />} />
                    <Route path="/code" element={<Code user={user} />} />
                    <Route exact path="/" element={<Home user={user} />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
};

export default Default;