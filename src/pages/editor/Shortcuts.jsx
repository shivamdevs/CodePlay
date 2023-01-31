import React from 'react';
import Layer from './Layer';

function Shortcuts({ close = null }) {
    return (
        <Layer width={400} title={<><i className="far fa-cog"></i> Shortcuts</>} onClose={close}>
            <div className="shortcut-body">
                <div className="shortcut-block">
                    <div className="setting-block-title">Exit panel / fullscreen / preview</div>
                    <kbd className="shortcut-key">Esc</kbd>
                </div>
                <div className="shortcut-block">
                    <div className="setting-block-title">Save / clone code</div>
                    <kbd className="shortcut-key">Ctrl + S</kbd>
                </div>
                <div className="shortcut-block">
                    <div className="setting-block-title">Shortcuts panel</div>
                    <kbd className="shortcut-key">Alt + Q</kbd>
                </div>
                <div className="shortcut-block">
                    <div className="setting-block-title">Settings panel</div>
                    <kbd className="shortcut-key">Alt + S</kbd>
                </div>
                <div className="shortcut-block">
                    <div className="setting-block-title">Resources panel</div>
                    <kbd className="shortcut-key">Alt + E</kbd>
                </div>
                <div className="shortcut-block">
                    <div className="setting-block-title">Fullscreen toggle</div>
                    <kbd className="shortcut-key">Alt + F</kbd>
                </div>
                <div className="shortcut-block">
                    <div className="setting-block-title">Enlarge preview toggle</div>
                    <kbd className="shortcut-key">Alt + W</kbd>
                </div>
                <div className="shortcut-block">
                    <div className="setting-block-title">Fullscreen toggle</div>
                    <kbd className="shortcut-key">Alt + F</kbd>
                </div>
                <div className="shortcut-block">
                    <div className="setting-block-title">Pane view toggle</div>
                    <kbd className="shortcut-key">Alt + G</kbd>
                </div>
                <div className="shortcut-block">
                    <div className="setting-block-title">Export as Zip</div>
                    <kbd className="shortcut-key">Alt + B</kbd>
                </div>
                <div className="shortcut-block">
                    <div className="setting-block-title">Export HTML build</div>
                    <kbd className="shortcut-key">Alt + H</kbd>
                </div>
            </div>
        </Layer>
    );
};

export default Shortcuts;