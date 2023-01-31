import React, { useEffect, useState } from 'react';
import { isBrowser, isMobile } from 'react-device-detect';
import { Link, useParams } from 'react-router-dom';
import app from '../../app.data';
import { getDisplayDate, setTitle } from '../../app.functions';
import { createFrameSourceURL, getCodeContent } from '../../fb.code';
import { getCoderData } from '../../fb.data';
import "./Player.css";

function Player() {

    const params = useParams();
    const [content, setContent] = useState(null);
    const [coderData, setCoderData] = useState(null);
    const [codeInvalid, setCodeInvalid] = useState(false);
    const [iframesource, setIframeSource] = useState(null);

    setTitle(content?.name, coderData?.name, "Player");

    useEffect(() => {
        if (params.playid) {
            getCodeContent(params.playid).then((data) => {
                if (data.type === "success") {
                    if (data.data) {
                        setContent(data.data);
                        setIframeSource(createFrameSourceURL(data.data));
                    } else {
                        setCodeInvalid("This play doesn't exists.");
                    }
                } else {
                    setCodeInvalid(data.data);
                }
            }, (err) => {
                setCodeInvalid(String(err));
            });
        } else {
            setCodeInvalid("No play code was recieved. Check the url.");
        }
    }, [params.playid]);

    useEffect(() => {
        content?.uid && (async () => {
            const data = await getCoderData(content?.uid);
            setCoderData(data.data);
        })();
    }, [content?.uid]);

    return (
        <section className='player'>
            {iframesource !== null && <iframe
                className="player-frame"
                src={iframesource}
                title={content?.name}
                onLoad={(e) => {
                    e.preventDefault();
                    // URL.revokeObjectURL(iframesource);
                }}
                onError={() => {
                    // URL.revokeObjectURL(iframesource);
                }}
            ></iframe>}
            {codeInvalid !== false && <div className="editor-invalid">
                <div className="editor-invalid-box">
                    <div className="editor-invalid-header">
                        <img src="/logo.png" alt="" />
                        <span>Failed to get play!</span>
                    </div>
                    <div className="editor-invalid-error">{codeInvalid}</div>
                    <div className="editor-invalid-option">
                        <Link to="/" className="bigbutton"><i className="far fa-home"></i> Home</Link>
                        <Link to="/code" className="bigbutton"><i className="fas fa-terminal"></i> Plays</Link>
                    </div>
                </div>
            </div>}
            <footer className="editor-footer player-footer">
                {isMobile && <div className="player-footer-flex-full">
                    {coderData && <div className="editor-footer-loader">By: {coderData.name}</div>}
                    {content && <div className="editor-footer-loader">Created: {getDisplayDate(content.created)}</div>}
                    {content && <div className="editor-footer-loader">Updated: {getDisplayDate(content.updated)}</div>}
                </div>}
                <div className="player-footer-flex-full">
                    <div className="editor-footer-flex">
                        <Link to="/" className="editor-footer-button">{isBrowser ? "CodePlay Home" : <i className="fas fa-home"></i>}</Link>
                        {content && <a href={`/code/${params.playid}`} className="editor-footer-button">{isBrowser ? "View Source code" : <i className="fas fa-code"></i>}</a>}
                        <a href="/code/new" className="editor-footer-button">{isBrowser ? "Create new code" : <i className="fas fa-plus"></i>}</a>
                        {isBrowser && <>
                            {coderData && <div className="editor-footer-loader">By: {coderData.name}</div>}
                            {content && <div className="editor-footer-loader">Created: {getDisplayDate(content.created)}</div>}
                            {content && <div className="editor-footer-loader">Updated: {getDisplayDate(content.updated)}</div>}
                        </>}
                    </div>
                    <div className="editor-footer-flex">
                        <div className="editor-footer-loader">© {app.parent} @2023-{new Date().getFullYear()}</div>
                        {content && <Link to={`/report/${params.playid}`} className="editor-footer-button">{isBrowser ? "Report play" : <i className="fas fa-flag-swallowtail"></i>}</Link>}
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default Player;