import React from 'react';
import "./Switch.css";
function Switch({checked = false, onClick = null, props}) {
    const toggleSwitch = () => {
        onClick && onClick(!checked);
    };
    return (
        <span className="switch" onClick={toggleSwitch} {...props}>
            <span className={`switch-toggle switch-toggle-${checked ? "on" : "off"}`}>
                {!checked && <i className="fas fa-times"></i>}
                {checked && <i className="fas fa-check"></i>}
            </span>
        </span>
    );
};

export default Switch;