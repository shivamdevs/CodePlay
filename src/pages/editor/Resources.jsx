import generateUniqueId from 'generate-unique-id';
import React from 'react';
import ReactDropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Layer from './Layer';

function Resources({ close = null, adder = null, resources = [] }) {
    const addResource = () => {
        adder && adder(old => {
            const data = { ...old };
            data.resources.push({
                id: generateUniqueId(32),
                position: "head",
                type: "stylesheet",
                content: "",
            });
            return data;
        });
    }
    return (
        <Layer title={<><i className="fas fa-puzzle-piece"></i> Resources</>} onClose={close}>
            {resources.map((item, index) => {
                return (<Resourse item={item} setter={adder} index={index} key={item.id} />);
            })}
            <div className="resource-item">
                <div className="resource-item-branch"></div>
                <div className="resource-item-content">
                    <button className="resource-item-add" onClick={addResource}><i className="fas fa-plus"></i> Add new resource</button>
                </div>
            </div>
        </Layer>
    );
};

export default Resources;

function Resourse({ item = null, setter = null, index = null }) {
    const updateResource = (key, value) => {
        setter && setter(old => {
            const data = { ...old };
            data.resources[index][key] = value;
            return data;
        });
    };
    const removeResource = () => {
        setter && setter(old => {
            const data = { ...old };
            data.resources.splice(index, 1);
            return data;
        });
    };
    return (
        <div className="resource-item">
            <div className="resource-item-branch"></div>
            <div className="resource-item-content">
                <div className="resource-item-flex">
                    <ReactDropdown className="resource-item-dropdown" onChange={({ value }) => updateResource("position", value)} options={["head", "body"]} value={item.position} />
                    <ReactDropdown className="resource-item-dropdown" onChange={({ value }) => updateResource("type", value)} options={["stylesheet", "script", "element"]} value={item.type} />
                </div>
                <div className="resource-item-flex">
                    <input className="resource-item-input" placeholder="Enter source..." onChange={({ target }) => updateResource("content", target.value)} defaultValue={item.content} type="text" />
                    <button className="resource-item-remove" onClick={removeResource}><i className="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    );
}