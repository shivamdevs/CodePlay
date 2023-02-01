import React from 'react';
import { setTitle } from '../../app.functions';
import Codes from '../../layouts/codes/Codes';

function Play({user = null}) {
    setTitle("Play");
    return (
        <div className="code-wallet">
            <div className="code-title">
                <div className="code-title-text">Recent Plays</div>
                <div className="code-title-options">
                </div>
            </div>
            <Codes user={null} coder={null} />
        </div>
    );
};

export default Play;