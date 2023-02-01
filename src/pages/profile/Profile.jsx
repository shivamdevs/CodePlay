import React, { useEffect, useState } from 'react';
import Codes from '../../layouts/codes/Codes';
import { useParams } from 'react-router-dom';
import { getCoderData } from '../../fb.data';
import { setTitle } from '../../app.functions';
import { toast } from 'react-hot-toast';

function Profile({ user = null }) {
    const params = useParams();
    const [coder, setCoder] = useState({});

    setTitle(coder?.name, "Coder Profile");
    useEffect(() => {
        (async () => {
            const data = await getCoderData(params.coderid);
            if (data.type === "success") {
                setCoder(data.data);
            } else {
                setCoder([]);
                toast.error(data.data);
            }
        })();
    }, [params.coderid]);
    return (
        <div className="code-wallet">
            <div className="code-title">
                <div className="code-title-text">{coder?.name}</div>
                <div className="code-title-options">
                </div>
            </div>
            <Codes user={user} coder={params.coderid} />
        </div>
    );
};

export default Profile;