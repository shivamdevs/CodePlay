import React, { useRef } from 'react';
import "./Layer.css";

function Layer({width = 800, title = "", style = {} , onClose = null, children, props}) {
    const layer = useRef();
    return (
        <div className="layer-cover" ref={layer} onClick={({target}) => target === layer.current && onClose && onClose()}>
            <div className="layer-container" style={{ maxWidth: `${width}px`, ...style }} {...props}>
                <div className="layer-header">
                    <div className="layer-title">{title}</div>
                    <button className="bigbutton layer-close" onClick={onClose}>Close</button>
                </div>
                <div className="layer-body">{children}</div>
            </div>
        </div>
    );
};

export default Layer;