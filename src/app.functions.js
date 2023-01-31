import app from "./app.data";

export const randomNumber = (min = 0, max = 9) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const randomString = (length = 5) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
};

export const setTitle = (...titles) => {
    let title = "";
    titles.forEach(one => one && (title += one + " • "));
    title += app.name;
    document.title = title;
};

export function arrayBufferToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
export function stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}


export function getDisplayDate(time, show = false) {
    const today = new Date();
    const onday = new Date(time);
    const datefrom = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dateto = new Date(onday.getFullYear(), onday.getMonth(), onday.getDate());
    const diff = datefrom.getTime() - dateto.getTime();
    const print = {
        date: `${String(onday.getDate()).padStart(2, "0")}-${String(onday.getMonth() + 1).padStart(2, "0")}-${onday.getFullYear()}`,
        time: `${onday.getHours() % 12 || 12}:${String(onday.getMinutes()).padStart(2, "0")} ${onday.getHours() < 12 ? "am" : "pm"}`,
    };
    if (datefrom.getTime() === dateto.getTime()) {
        return (show ? "Today" : print.time);
    } else if (diff <= (24 * 60 * 60 * 1000)) {
        return "Yesterday";
    } else {
        return print.date;
    }
}