import React from 'react';
import { isBrowser } from 'react-device-detect';
import { Link } from 'react-router-dom'
import { setTitle } from '../../app.functions';
import Codes from '../../layouts/codes/Codes';
import "./Code.css";

function Code({ user = null }) {
    setTitle("Code");
    return (
        <div className="code-wallet">
            <div className="code-title">
                <div className="code-title-text">My codes</div>
                <div className="code-title-options">
                    {user && <a href="/code/new" className="bigbutton"><i className="fas fa-plus"></i> {isBrowser && "Create new code"}</a>}
                </div>
            </div>
            {user && <Codes user={user} coder={user} path="/code/" showDeleter={true} />}
            {!user && <div className="editor-start-wrapper">
                <div className="editor-start">
                    <div className="editor-start-header">Signin to CodePlay</div>
                    <div className="editor-start-subheader">You need to be loggedin to CodePlay to be able to view codes.</div>
                    <div className="editor-start-option">
                        <Link to="/accounts" className="bigbutton">Sign in</Link>
                        <Link to="/" className="bigbutton">Go to Home</Link>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default Code;