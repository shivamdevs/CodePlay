import React from 'react';
import ReactDropdown from 'react-dropdown';
import app from '../../app.data';
import Switch from '../../components/switch/Switch';
import Layer from './Layer';

function Settings({ settings = {}, update = null, close = null }) {
    return (
        <Layer width={600} title={<><i className="far fa-cog"></i> Settings</>} onClose={close}>
            <div className="setting-body">
                <div className="setting-block-subtitle">These changes are saved on your localStorage. and will be saved there even after you sign out.<br /><br /></div>
                <div className="setting-block-subtitle">Always check the settings before starting to edit any code on a new device.<br /><br /><br /></div>
                <div className="setting-block">
                    <div className="setting-block-left">
                        <div className="setting-block-title">Theme</div>
                        <div className="setting-block-subtitle">Based on editor component default themes</div>
                    </div>
                    <div className="setting-block-right">
                        <ReactDropdown className="setting-select resource-item-dropdown" onChange={({value}) => update("theme", value)} value={settings.theme} options={["vs", "vs-dark", "hc-black", "hc-light"]} />
                    </div>
                </div>
                <div className="setting-block">
                    <div className="setting-block-left">
                        <div className="setting-block-title">Preview delay</div>
                        <div className="setting-block-subtitle">Preview build delay time in ms</div>
                    </div>
                    <div className="setting-block-right">
                        <input type="number" className="resource-item-input" placeholder="Delay in ms" onChange={({ target }) => update("previewDelay", parseInt(target.value ?? 3000) ?? 3000)} value={settings.previewDelay} />
                    </div>
                </div>
                <div className="setting-block">
                    <div className="setting-block-left">
                        <div className="setting-block-title">Auto save</div>
                        <div className="setting-block-subtitle">Auto save the code after preview build</div>
                    </div>
                    <div className="setting-block-right">
                        <Switch checked={settings.autoSave} onClick={(value) => update("autoSave", value)} />
                    </div>
                </div>
                <div className="setting-block">
                    <div className="setting-block-left">
                        <div className="setting-block-title">Push time</div>
                        <div className="setting-block-subtitle">Display time of push messages displayed at the bottom</div>
                    </div>
                    <div className="setting-block-right">
                        <input type="number" className="resource-item-input" placeholder="Time in ms" onChange={({ target }) => update("pushTime", parseInt(target.value ?? 3000) ?? 3000)} value={settings.pushTime} />
                    </div>
                </div>
                <div className="setting-block">
                    <div className="setting-block-left">
                        <div className="setting-block-title">Reset changes</div>
                        <div className="setting-block-subtitle">Revert back to default settings</div>
                    </div>
                    <div className="setting-block-right">
                        <button className="bigbutton" onClick={() => {
                            update("theme", "vs-dark");
                            update("pushTime", 3000);
                            update("autoSave", false);
                            update("previewDelay", 3000);
                        }}>Restore settings</button>
                    </div>
                </div>
                <div className="setting-block">
                    <div className="setting-block-left">
                        <div className="setting-block-title">Reset resizes</div>
                        <div className="setting-block-subtitle">Reset the width of resized editor</div>
                        <div className="setting-block-subtitle">Takes time to reflect</div>
                    </div>
                    <div className="setting-block-right">
                        <button className="bigbutton" onClick={() => {
                            if (window.localStorage) window.localStorage.setItem(`${app.bucket}editor:resize:data`, JSON.stringify({}));
                        }}>Restore resize</button>
                    </div>
                </div>
            </div>
        </Layer>
    );
};

export default Settings;