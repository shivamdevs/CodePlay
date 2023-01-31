import React, { useEffect, useState } from 'react';
import "./Swapper.css";

function Swapper({swap = []}) {
    const [text, setText] = useState("");
    useEffect(() => {
        const updateText = (item, dir) => {
            setText(old => {
                if (old === "") {
                    item = swap[swap.indexOf(item) + 1];
                    if (!item) item = swap[0];
                    dir = 1;
                } else if (old === item) {
                    dir = -1;
                }
                setTimeout(() => updateText(item, dir), 300);

                if (dir < 0) {
                    return old.slice(0, -1);
                } else {
                    return old + item.slice(old.length, old.length + 1);
                }
            });
        }
        updateText(swap[0]);
    }, [swap]);
    return (
        <span className="swapper">{text}<span className="swapper-cursor"></span></span>
    )
}

export default Swapper;