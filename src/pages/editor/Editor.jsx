import { ReflexContainer, ReflexElement, ReflexHandle, ReflexSplitter } from 'react-reflex';
import "react-reflex/styles.css";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setTitle } from '../../app.functions';
import "./Editor.css";
import app from '../../app.data';
import CodeEditor from '@monaco-editor/react';
import { LoadSVG } from '../../components/loading/Loading';
import { createFrameSourceURL, getCodeContent, getMarkup, getMarkupHTML, saveCode } from '../../fb.code';
import { createCodeId } from '../../fb.code';
import { getCoderData } from '../../fb.data';
import classNames from 'classnames';
import Resources from './Resources';
import Settings from './Settings';
import Shortcuts from './Shortcuts';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function Editor({ user = null }) {
    const params = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const [iframesource, setIframeSource] = useState(null);
    const sectionElement = useRef();
    const iFrameElement = useRef();
    setTitle(content?.name, "Code Editor");

    const [codeInvalid, setCodeInvalid] = useState(false);

    const [editorSettings, setEditorSettings] = useState(() => {
        const saved = (() => {
            if (window.localStorage) {
                try {
                    const item = window.localStorage.getItem(`${app.bucket}editor:settings`);
                    if (item !== null)
                        return JSON.parse(item);
                } catch (e) {
                    return {};
                }
            }
            return {};
        })();
        if (!saved.theme) saved.theme = "vs-dark";
        if (!saved.previewDelay && saved.previewDelay !== 0) saved.previewDelay = 3000;
        if (!saved.pushTime && saved.pushTime !== 0) saved.pushTime = 3000;
        if (!saved.autoSave && saved.autoSave !== false) saved.autoSave = false;
        return saved;
    });

    const [pushlogdata, setPushlogdata] = useState("");
    const [pushlogtimer, setPushlogtimer] = useState(null);
    const [frameTimeout, setFrameTimeout] = useState(null);
    const pushlog = useCallback((data, preserve = false) => {
        clearTimeout(pushlogtimer);
        setPushlogdata(<>{data}</>);
        !preserve && setPushlogtimer(setTimeout(() => {
            setPushlogdata("");
        }, editorSettings.pushTime));
    }, [editorSettings.pushTime, pushlogtimer]);

    const updateIframeContents = (data, delay = true) => {
        clearTimeout(frameTimeout);
        setFrameTimeout(setTimeout(() => {
        const url = createFrameSourceURL(data);
        pushlog(<><span>Loading preview</span><LoadSVG /></>, true);
        if (iframesource) {
            if (iFrameElement.current) iFrameElement.current.contentWindow.location.replace(url);
        } else {
            setIframeSource(url);
        }
        }, delay ? editorSettings.previewDelay : 0));
    };

    const [contentClonable, setContentClonable] = useState(false);

    useEffect(() => {
        if (user) {
            if (params.codeid) {
                if (params.codeid === "new") {
                    createCodeId(user).then((data) => {
                        if (data.type === "success") {
                            navigate(`/code/${data.data}`, { replace: true });
                        } else {
                            setCodeInvalid(data.data);
                        }
                    }, (err) => {
                        setCodeInvalid(String(err));
                    });
                } else {
                    getCodeContent(params.codeid).then((data) => {
                        if (data.type === "success") {
                            if (data.data) {
                                setContent(data.data);
                                if (data.data.uid !== user.uid) {
                                    setContentClonable(true);
                                }
                            } else {
                                setCodeInvalid("This code doesn't exists.");
                            }
                        } else {
                            setCodeInvalid(data.data);
                        }
                    }, (err) => {
                        setCodeInvalid(String(err));
                    });
                }
            } else {
                setCodeInvalid("No code was recieved. Check the url.");
            }
        }
    }, [navigate, params.codeid, user]);

    function updateEditorSettings(key, value) {
        setEditorSettings(old => {
            const data = { ...old };
            data[key] = value;
            if (window.localStorage) window.localStorage.setItem(`${app.bucket}editor:settings`, JSON.stringify(data));
            return data;

        });
    }


    function updateEditorChanges(value, mark) {
        setContent(old => {
            const data = { ...old };
            data[mark] = value;
            updateIframeContents(data);
            return data;
        });
        setContentSaved(false);
    }

    const resizeData = (() => {
        if (window.localStorage) {
            try {
                const item = window.localStorage.getItem(`${app.bucket}editor:resize:data`);
                if (item !== null)
                    return JSON.parse(item);
            } catch (e) {
                return {};
            }
        }
        return {};
    })();
    function saveResizeData(event) {
        const { name, flex } = event?.component?.props || event;
        resizeData[name] = flex;
        if (window.localStorage) window.localStorage.setItem(`${app.bucket}editor:resize:data`, JSON.stringify(resizeData));
    }

    const [savingContent, setSavingContent] = useState(false);
    const [contentSaved, setContentSaved] = useState(true);
    const saveButton = useRef();

    const saveContent = async () => {
        setSavingContent(true);
        setContentClonable(false);
        pushlog(<><span>Saving code</span><LoadSVG /></>, true);
        const status = await saveCode(user, content);
        if (status.type === "success") {
            if (status.data !== content.id) {
                navigate(`/code/${status.data}`, { replace: true });
            }
            pushlog(<><span>Saved</span><i className="far fa-check success"></i></>);
            setContentSaved(true);
        } else if (status.type === "error") {
            pushlog(<><span>Saving failed: {status.data}</span><i className="far fa-times error"></i></>);
        }
        setSavingContent(false);
    };

    const [coderData, setCoderData] = useState(null);
    useEffect(() => {
        content?.uid && (async () => {
            const data = await getCoderData(content?.uid);
            setCoderData(data.data);
        })();
    }, [content?.uid]);

    const [isWindowFullScreen, setIsWindowFullScreen] = useState(false);
    const toggleWindowAspect = () => {
        const element = sectionElement.current;
        var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
        element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () {
            return false;
        };
        document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () {
            return false;
        };
        isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
    };

    const toggleWindowAspectHandler = () => {
        const isFullscreen = !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement;
        setIsWindowFullScreen(!isFullscreen);
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', toggleWindowAspectHandler, false);
        document.addEventListener('mozfullscreenchange', toggleWindowAspectHandler, false);
        document.addEventListener('MSFullscreenChange', toggleWindowAspectHandler, false);
        document.addEventListener('webkitfullscreenchange', toggleWindowAspectHandler, false);
        return () => {
            document.removeEventListener('fullscreenchange', toggleWindowAspectHandler);
            document.removeEventListener('mozfullscreenchange', toggleWindowAspectHandler);
            document.removeEventListener('MSFullscreenChange', toggleWindowAspectHandler);
            document.removeEventListener('webkitfullscreenchange', toggleWindowAspectHandler);
        };
    }, []);



    useEffect(() => {
        const handler = (event) => {
            event.preventDefault();
            event.returnValue = "";
        };
        if (!contentSaved) {
            window.addEventListener("beforeunload", handler);
            return () => {
                window.removeEventListener("beforeunload", handler);
            };
        }
        return () => { };
    }, [contentSaved]);

    const [isPreviewEnlarged, setIsPreviewEnlarged] = useState(false);
    const togglePreviewAspect = useCallback(() => {
        setIsPreviewEnlarged(!isPreviewEnlarged);
    }, [isPreviewEnlarged]);

    const [isResourceOpen, setIsResourceOpen] = useState(false);
    const toggleResourcePanel = useCallback(() => {
        setIsResourceOpen(!isResourceOpen);
    }, [isResourceOpen]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const toggleSettingsPanel = useCallback(() => {
        setIsSettingsOpen(!isSettingsOpen);
    }, [isSettingsOpen]);

    const [isShortcutOpen, setIsShortcutOpen] = useState(false);
    const toggleShortcutPanel = useCallback(() => {
        setIsShortcutOpen(!isShortcutOpen);
    }, [isShortcutOpen]);

    const [exportingZip, setExportingZip] = useState(false);
    const exportContentsAsZip = useCallback(() => {
        setExportingZip(true);
        const zip = new JSZip();
        zip.file("index.html", getMarkupHTML(content));
        zip.file("styles.css", content?.css);
        zip.file("script.js", content?.javascript);
        zip.generateAsync({ type: "blob" }).then(function (data) {
            saveAs(data, `${(content?.name).toLowerCase().replace(/([^a-z0-9]+)/gi, '-')}.zip`);
            setExportingZip(false);
        });
    }, [content]);

    const [exportingHTML, setExportingHTML] = useState(false);
    const exportContentsAsHTML = useCallback(() => {
        setExportingHTML(true);
        const zip = new JSZip();
        zip.file("index.html", getMarkup(content));
        zip.generateAsync({ type: "blob" }).then(function (data) {
            saveAs(data, `${(content?.name).toLowerCase().replace(/([^a-z0-9]+)/gi, '-')}-build.zip`);
            setExportingHTML(false);
        });
    }, [content]);

    useEffect(() => {
        const handle = (e) => {
            const key = e.which || e.keyCode;
            if (key === 27) {
                if (isResourceOpen) toggleResourcePanel();
                else if (isPreviewEnlarged) togglePreviewAspect();
                else return;
            } else if (key === 83 && e.ctrlKey) {
                saveButton?.current?.click();
            } else if (key === 83 && e.altKey) {
                toggleSettingsPanel();
            } else if (key === 69 && e.altKey) {
                toggleResourcePanel();
            } else if (key === 87 && e.altKey) {
                togglePreviewAspect();
            } else if (key === 81 && e.altKey) {
                toggleShortcutPanel();
            } else if (key === 70 && e.altKey) {
                toggleWindowAspect();
            } else if (key === 71 && e.altKey) {
                updateEditorSettings("flipDirection", !editorSettings.flipDirection)
            } else {
                return;
            }
            e.preventDefault();
        }
        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
    }, [editorSettings.flipDirection, isPreviewEnlarged, isResourceOpen, togglePreviewAspect, toggleResourcePanel, toggleSettingsPanel, toggleShortcutPanel]);

    return (
        <section className="editor" ref={sectionElement}>
            <header className="editor-header">
                <div className="editor-header-flex">
                    <a href="/"><img src="/logo.png" alt="" className="editor-header-logo" /></a>
                    {content && <form onSubmit={(e) => { e.preventDefault(); e.target[0].blur(); }} className="editor-header-data">
                        <span className="editor-header-hidden">{{ ...content }.name}</span>
                        <input className="editor-header-name" onBlur={({ target }) => setContent(old => {
                            const x = { ...old };
                            x.name = target.value.trim();
                            if (x.name === "") {
                                x.name = "Untitled";
                                target.value = "Untitled";
                            }
                            return x;
                        })} defaultValue={content?.name} onChange={({ target }) => {
                            target.previousElementSibling.innerHTML = target.value;
                            setContentSaved(false);
                        }} />
                        {coderData && <a href={`/cp/${coderData.uid}`} className="editor-header-user">By: {coderData.name}</a>}
                    </form>}
                </div>
                {content && <div className="editor-header-flex">
                    <button className="bigbutton" onClick={toggleSettingsPanel}><i className={`far fa-cog`}></i></button>
                    <button className="bigbutton" onClick={() => updateEditorSettings("flipDirection", !editorSettings.flipDirection)}><i className={`far fa-${editorSettings.flipDirection ? "window" : "sidebar"}-flip`}></i></button>
                    <button className="bigbutton" onClick={saveContent} ref={saveButton} disabled={!contentClonable ?? (savingContent || contentSaved)}>{contentClonable ? "Clone" : savingContent ? "Saving..." : contentSaved ? "Saved" : "Save"}</button>
                </div>}
            </header>
            {content && <ReflexContainer className="editor-main" orientation={editorSettings.flipDirection ? "vertical" : "horizontal"}>
                <ReflexElement name="panel" flex={resizeData.panel || 0.5} onResize={saveResizeData}>
                    <ReflexContainer orientation={editorSettings.flipDirection ? "horizontal" : "vertical"}>
                        <ReflexElement name="html" flex={resizeData.html || 0.333333} onResize={saveResizeData} minSize={20} className="editor-resize-panel">
                            <div className="editor-resize-handle"><img src="/assets/images/editor/html.svg" alt="" /> HTML</div>
                            <div className="editor-container">
                                <CodeEditor
                                    onMount={() => updateIframeContents(content, false)}
                                    defaultValue={content?.html}
                                    defaultLanguage='html'
                                    language='html'
                                    theme={editorSettings.theme}
                                    onChange={(value) => updateEditorChanges(value, "html")}
                                />
                            </div>
                        </ReflexElement>
                        <ReflexSplitter propagate={true} className="editor-splitter-x" />
                        <ReflexElement name="css" flex={resizeData.css || 0.333333} onResize={saveResizeData} minSize={20} className="editor-resize-panel">
                            <ReflexHandle className="editor-resize-handle"><img src="/assets/images/editor/css.svg" alt="" /> CSS</ReflexHandle>
                            <div className="editor-container">
                                <CodeEditor
                                    defaultValue={content?.css}
                                    defaultLanguage='css'
                                    language='css'
                                    theme={editorSettings.theme}
                                    onChange={(value) => updateEditorChanges(value, "css")}
                                />
                            </div>
                        </ReflexElement>
                        <ReflexSplitter propagate={true} className="editor-splitter-x" />
                        <ReflexElement name="javascript" flex={resizeData.javascript || 0.333333} onResize={saveResizeData} minSize={20} className="editor-resize-panel">
                            <ReflexHandle className="editor-resize-handle"><img src="/assets/images/editor/javascript.svg" alt="" /> JavaScript</ReflexHandle>
                            <div className="editor-container">
                                <CodeEditor
                                    defaultValue={content?.javascript}
                                    defaultLanguage='javascript'
                                    language='javascript'
                                    theme={editorSettings.theme}
                                    onChange={(value) => updateEditorChanges(value, "javascript")}
                                />
                            </div>
                        </ReflexElement>
                    </ReflexContainer>
                </ReflexElement>
                <ReflexSplitter className="editor-splitter-y" />
                <ReflexElement name="preview" flex={resizeData.preview || 0.5} onResize={saveResizeData}>
                    {iframesource !== null && <iframe
                        className={classNames("editor-iframe", { "editor-iframe-enlarged": isPreviewEnlarged })}
                        src={iframesource}
                        title={content?.name}
                        sandbox="allow-scripts"
                        ref={iFrameElement}
                        onLoad={(e) => {
                            e.preventDefault();
                            pushlog(<><span>Preview loaded</span><i className="far fa-check"></i></>);
                            if (editorSettings.autoSave) saveButton?.current?.click();
                            URL.revokeObjectURL(e.target.src);
                        }}
                        onError={(e) => {
                            pushlog(<><span>Preview loading failed</span><i className="far fa-times error"></i></>);
                            if (editorSettings.autoSave) saveButton?.current?.click();
                            URL.revokeObjectURL(e.target.src);
                        }}
                    ></iframe>}
                </ReflexElement>
            </ReflexContainer>}
            {!content && <main className="editor-main">
                {!user && <div className="editor-start">
                    <div className="editor-start-header">Signin to CodePlay</div>
                    <div className="editor-start-subheader">You need to be loggedin to CodePlay to be able to create, view, edit or clone the code.</div>
                    <div className="editor-start-option">
                        <a href="/accounts" className="bigbutton">Sign in</a>
                        <a href="/" className="bigbutton">Go to Home</a>
                    </div>
                </div>}
            </main>}
            <footer className="editor-footer">
                {content && <>
                    <div className="editor-footer-flex">
                        <button className="editor-footer-button" onClick={toggleResourcePanel}>Resources</button>
                        <button className="editor-footer-button" onClick={toggleShortcutPanel}>Shortcuts</button>
                        <button className="editor-footer-button" onClick={togglePreviewAspect}>{isPreviewEnlarged ? "Restore" : "Enlarge"} preview</button>
                        <button className="editor-footer-button" onClick={toggleWindowAspect}>{isWindowFullScreen ? "Exit f" : "F"}ullscreen</button>
                    </div>
                    <div className="editor-footer-flex">
                        <div className="editor-footer-loader">{pushlogdata}</div>
                        <button className="editor-footer-button" onClick={() => updateIframeContents(content, false)}>Build</button>
                        <button className="editor-footer-button" disabled={exportingZip} onClick={exportContentsAsZip}>{exportingZip ? "Exporting..." : "Export Zip"}</button>
                        <button className="editor-footer-button" disabled={exportingHTML} onClick={exportContentsAsHTML}>{exportingHTML ? "Exporting..." : "Export Build"}</button>
                        <a href={`/play/${params.codeid}`} className="editor-footer-button">Play</a>
                    </div></>}
            </footer>
            {codeInvalid !== false && <div className="editor-invalid">
                <div className="editor-invalid-box">
                    <div className="editor-invalid-header">
                        <img src="/logo.png" alt="" />
                        <span>Failed to get code!</span>
                    </div>
                    <div className="editor-invalid-error">{codeInvalid}</div>
                    <div className="editor-invalid-option">
                        <a href="/" className="bigbutton"><i className="far fa-home"></i> Home</a>
                        <a href="/code" className="bigbutton"><i className="fas fa-terminal"></i> Code</a>
                    </div>
                </div>
            </div>}
            {isResourceOpen && <Resources resources={content.resources} adder={(callback) => setContent(old => { setContentSaved(false); const id = callback(old); updateIframeContents(id); return id; })} close={toggleResourcePanel} />}
            {isSettingsOpen && <Settings resize={resizeData} rescue={saveResizeData} settings={editorSettings} update={updateEditorSettings} close={toggleSettingsPanel} />}
            {isShortcutOpen && <Shortcuts close={toggleShortcutPanel} />}
        </section>
    );
};

export default Editor;