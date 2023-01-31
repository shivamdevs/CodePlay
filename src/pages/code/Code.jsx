import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { isBrowser, isMobile } from 'react-device-detect';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getDisplayDate, setTitle } from '../../app.functions';
import { LoadSVG } from '../../components/loading/Loading';
import { deleteCode } from '../../fb.code';
import { getAllCodes, getCodePlayPreview } from '../../fb.data';
import "./Code.css";

function Code({ user = null }) {
    setTitle("Code");
    const [mycodes, setCodes] = useState(null);
    const [deleter, setDeleter] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const deleteStart = async () => {
        setDeleting(true);
        const code = {...deleter};
        const del = await deleteCode(user, code);
        if (del.type !== "success") {
            toast.error(del.data);
        } else getCodes();
        setDeleter(null);
        setDeleting(false);
    };

    const getCodes = useCallback(async () => {
        if (user) {
            const docs = await getAllCodes(user);
            if (docs.type === "success") {
                setCodes(docs.data);
            } else {
                setCodes([]);
                toast.error("Failed to get your codes: " + docs.data);
            }
        }
    }, [user]);
    useEffect(() => {
        getCodes();
    }, [getCodes]);
    return (
        <div className="code-wallet">
            <div className="code-title">
                <div className="code-title-text">My codes</div>
                <div className="code-title-options">
                    {user && <a href="/code/new" className="bigbutton"><i className="fas fa-plus"></i> {isBrowser && "Create new code"}</a>}
                </div>
            </div>
            {user && <div className="code-viewer">
                {mycodes === null && <div className="code-loading"><LoadSVG /></div>}
                {mycodes && mycodes.length === 0 && <div className="code-loading">You don't have any codes yet!</div>}
                {mycodes && mycodes.length > 0 && mycodes.map(item => <CodeBlock delta={setDeleter} item={item} key={item.id} />)}
            </div>}
            {deleter !== null && <div className="code-verify">
                <div className="code-verify-center">
                    {!deleting && <>
                        <div className="code-verify-title">Delete code</div>
                        <div className="code-verify-text">{deleter.name} ({deleter.id})</div>
                        <div className="code-verify-text">This code can not be restored unless there exists a clone.</div>
                        <div className="code-verify-option">
                            <button className="bigbutton code-verify-delete" onClick={deleteStart}>Delete</button>
                            <button className="bigbutton" onClick={() => setDeleter(null)}>Cancel</button>
                        </div>
                    </>}
                    {deleting && <>
                        <div className="code-verify-title">Deleting</div>
                        <div className="code-verify-option"><LoadSVG /></div>
                    </>}
                </div>
            </div>}
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

function CodeBlock({ item = null, delta = null }) {
    const [image, setImage] = useState("");
    useEffect(() => {
        (async () => {
            setImage(await getCodePlayPreview(item));
        })();
    }, [item]);
    return (
        <a href={`/code/${item.id}`} className={classNames("code-block", { "code-block-item": isMobile })}>
            <img className='skeleton' src={image} alt="" />
            <div className="code-block-name">{item.name}</div>
            <div className="code-block-date">Updated: {getDisplayDate(item.updated)}</div>
            <div className="code-block-date">Created: {getDisplayDate(item.created)}</div>
            <button className="code-block-delete roundbutton" onClick={(e) => { e.preventDefault(); delta(item); }}><i className="fas fa-trash"></i></button>
        </a>
    );
}