import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { clarifyError, db } from "./fb.user";
import generate from 'generate-unique-id';
import sortBy from "sort-by";
import { createFrameSourceURL } from "./fb.code";
import html2canvas from "html2canvas";


export const table = "codeplay";

export async function getAllCodes(user) {
    try {
        const q = user ? query(collection(db, table), where("uid", "==", user.uid || user), where("deleted", "==", false)) : query(collection(db, table));
        const snap = await getDocs(q);
        const result = [];
        if (!snap.empty) {
            snap.docs.forEach((item) => {
                result.push({ ...item.data(), id: item.id, ref: item.ref });
            });
        }
        return {
            type: "success",
            data: result.sort(sortBy("updated")).reverse(),
        }
    } catch (err) {
        console.error(err);
        return clarifyError(err);
    }
}

export async function getAllUsers() {
    try {
        const q = query(collection(db, "users"));
        const snap = await getDocs(q);
        const result = {};
        if (!snap.empty) {
            snap.docs.forEach((item) => {
                result[item.id] = item.data();
            });
        }
        return {
            type: "success",
            data: result,
        }
    } catch (err) {
        console.error(err);
        return clarifyError(err);
    }
}


export async function getUniqueFirebaseId(tb, length = 7) {
    return new Promise(async function (resolve, reject) {
        try {
            let found = false, id = null;
            while (!found) {
                id = generate({ length });
                const data = await getDoc(doc(db, tb, id));
                found = !data.exists();
            }
            resolve({ type: "success", data: id });
        } catch (err) {
            console.error(err);
            reject(clarifyError(err));
        }
    });
}

export async function getCoderData(uid) {
    return new Promise(async function (resolve, reject) {
        try {
            const data = await getDoc(doc(db, "users", uid));
            if (data.exists()) {
                resolve({ type: "success", data: data.data() });
            } else {
            }
        } catch (err) {
            console.error(err);
            reject(clarifyError(err));
        }
    });
}

export async function getCodePlayPreview(content) {
    return new Promise((resolve) => {
        const url = createFrameSourceURL(content);
        const frame = document.createElement("iframe");
        frame.setAttribute("sandbox", "allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-top-navigation allow-top-navigation-by-user-activation");
        frame.setAttribute("allowfullscreen", "true");
        frame.setAttribute("allowtransparency", "true");
        frame.setAttribute("allowpaymentrequest", "true");
        frame.setAttribute("allow", "autoplay *; camera *; microphone *; geolocation *");
        frame.style.zIndex = "-111111111111111";
        frame.style.position = "fixed";
        frame.style.top = "0";
        frame.style.left = "0";
        frame.style.width = "600px";
        frame.style.height = "400px";
        frame.onload = () => {
            setTimeout(() => {
                html2canvas(frame.contentWindow.document.body).then(function (canvas) {
                    resolve(canvas.toDataURL());
                    if (document.contains(frame)) frame.parentElement.removeChild(frame);
                });
            }, 1000);
            URL.revokeObjectURL(url);
        }
        frame.onerror = () => {
            resolve("/icon.png");
            if (document.contains(frame)) frame.parentElement.removeChild(frame);
            URL.revokeObjectURL(url);
        }
        frame.src = url;
        document.body.appendChild(frame);
    });
}