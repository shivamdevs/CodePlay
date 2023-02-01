import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import groupBy from "group-by";
import { getUniqueFirebaseId, table } from "./fb.data";
import { clarifyError, db } from "./fb.user";

export function createFrameSourceURL(data) {
    const markup = getMarkup(data);
    const blob = new Blob([markup], { type: "text/html" });
    return URL.createObjectURL(blob);
}
export function getMarkup(data) {
    let resources = data?.resources || [];
    resources = groupBy(resources, "position");
    return `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${data?.name}</title>
            ${(resources && resources.head && resources.head?.length > 0 && resources.head.map(head => {
                if (head.type === "stylesheet") {
                    return `<link rel="stylesheet" href="${head.content}">`;
                } else if (head.type === "script") {
                    return `<script src="${head.content}"></script>`;
                }
                return head.content;
            })) || ""}
            <style>${data?.css}</style>
        </head>
        <body>${data?.html || ""}</body>
        </html>
        ${(resources && resources.body && resources.body?.length > 0 && resources.body.map(body => {
            if (body.type === "stylesheet") {
                return `<link rel="stylesheet" href="${body.content}">`;
            } else if (body.type === "script") {
                return `<script src="${body.content}"></script>`;
            }
            return body.content;
        })) || ""}
        <script>${data?.javascript || ""}</script>
    `;
}
export function getMarkupHTML(data) {
    let resources = data?.resources || [];
    resources = groupBy(resources, "position");
    return `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${data?.name}</title>
            ${(resources && resources.head && resources.head?.length > 0 && resources.head.map(head => {
                if (head.type === "stylesheet") {
                    return `<link rel="stylesheet" href="${head.content}">`;
                } else if (head.type === "script") {
                    return `<script src="${head.content}"></script>`;
                }
                return head.content;
            })).join("") || ""}
            <link rel="stylesheet" href="./styles.css">
        </head>
        <body>${data?.html || ""}</body>
        </html>
        ${(resources && resources.body && resources.body?.length > 0 && resources.body.map(body => {
            if (body.type === "stylesheet") {
                return `<link rel="stylesheet" href="${body.content}">`;
            } else if (body.type === "script") {
                return `<script src="${body.content}"></script>`;
            }
            return body.content;
        })).join("") || ""}
        <script src="./script.js"></script>
    `
}
export async function createCodeId(user) {
    return new Promise(async (resolve, reject) => {
        try {
            const id = await getUniqueFirebaseId(table);
            await setDoc(doc(db, table, id.data), {
                uid: user.uid,
                name: "Untitled",
                html: "",
                css: "",
                javascript: "",
                resources: [],
                created: Date.now(),
                updated: Date.now(),
                deleted: false,
            });
            resolve({type: "success", data: id.data});
        } catch (err) {
            console.error(err);
            reject(clarifyError(err));
        }
    });
}
export async function deleteCode(user, code) {
    try {
        if (user && code.uid === user.uid) {
            await deleteDoc(code.ref);
            return {
                type: "success",
                data: null
            }
        } else return {
            type: "error",
            data: "User not authorised.",
        }
    } catch (err) {
        console.error(err);
        return clarifyError(err);
    }
}
export async function saveCode(user, data) {
    const content = { ...data };
    try {
        if (!content.id || content.id === "new" || content.uid !== user.uid) {
            const getid = await createCodeId(user);
            if (getid.type === "error") {
                return getid;
            }
            content.id = getid.data;
            content.created = Date.now();
        }
        const id = content.id;
        delete content.id;
        content.uid = user.uid;
        content.updated = Date.now();
        await updateDoc(doc(db, table, id), content);
        return { type: "success", data: id };
    } catch (err) {
        console.error(err);
        return clarifyError(err);
    }
}

export async function getCodeContent(code) {
    try {
        const data = await getDoc(doc(db, table, code));
        if (data.exists()) {
            return {type: "success", data: {...data.data(), id: data.id}};
        } else {
            return { type: "success", data: null };
        }
    } catch (err) {
        console.error(err);
        return clarifyError(err);
    }
}