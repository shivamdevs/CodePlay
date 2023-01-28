! function () {
    "use strict";
    let e = 0,
        t = !1;
    const r = e => e.every((t => "null" !== e[0] && t === e[0])),
        c = ["012", "345", "678", "036", "147", "258", "048", "246"],
        o = document.querySelectorAll("grid-box"),
        n = document.querySelector("grid-play"),
        s = document.querySelector("square"),
        l = document.querySelector("grid-reset[all]"),
        u = document.querySelector("grid-reset[now]"),
        a = document.querySelector("score-count[count]"),
        i = document.querySelector("score-count[cross]"),
        d = document.querySelector("score-count[circle]"),
        b = function () {
            window.localStorage ? (t = !0, null !== localStorage.getItem("count") ? a.innerHTML = localStorage.getItem("count") : localStorage.setItem("count", "0"), null !== localStorage.getItem("cross") ? i.innerHTML = localStorage.getItem("cross") : localStorage.setItem("cross", "0"), null !== localStorage.getItem("circle") ? d.innerHTML = localStorage.getItem("circle") : localStorage.setItem("circle", "0")) : console.log("Cannot save scores to the servers.")
        };
    b(), b.reset = function () {
        t && (localStorage.setItem("count", "0"), localStorage.setItem("cross", "0"), localStorage.setItem("circle", "0")), a.innerHTML = "0", i.innerHTML = "0", d.innerHTML = "0"
    }, b.update = function (e) {
        if (t) localStorage.setItem(e, +localStorage.getItem(e) + 1), document.querySelector("score-count[" + e + "]").innerHTML = localStorage.getItem(e);
        else {
            const t = document.querySelector("score-count[" + e + "]");
            t.innerHTML = +t.innerHTML + 1
        }
    };
    const f = function (e) {
        o.forEach(((t, r) => {
            e.includes(r) ? t.setAttribute("pass", "") : t.setAttribute("fail", "")
        })), s.setAttribute("reset", "")
    },
        m = function () {
            for (let e of c) {
                let t = [];
                if (e.split("").forEach(((e, r) => {
                    let c = o[e];
                    c.hasAttribute("pass") || c.hasAttribute("fail") || (c.hasAttribute("checked") ? c.hasAttribute("circle") ? t.push("circle") : c.hasAttribute("cross") && t.push("cross") : t.push("null"))
                })), r(t)) return b.update(t[0]), b.update("count"), f(e)
            }
            for (let e of o)
                if (!e.hasAttribute("checked")) return;
            return function () {
                for (let e of o) e.setAttribute("fail", "");
                s.setAttribute("reset", ""), e = 0, b.update("count")
            }()
        };
    o.forEach(((t, r) => {
        t.addEventListener("click", (function () {
            t.hasAttribute("checked") || (t.setAttribute("checked", ""), t.setAttribute(e ? "cross" : "circle", ""), e = e ? 0 : 1, m())
        }))
    })), n.addEventListener("click", (function () {
        s.removeAttribute("reset"), o.forEach(((e, t) => {
            e.removeAttribute("pass"), e.removeAttribute("fail"), e.removeAttribute("checked"), e.removeAttribute("circle"), e.removeAttribute("cross")
        })), e = 0
    })), l.addEventListener("click", (function () {
        n.click(), b.reset()
    })), u.addEventListener("click", (function () {
        n.click()
    })), window.addEventListener("keypress", (function (e) {
        if (s.hasAttribute("reset")) return n.click();
        let t = 4;
        switch (e.key) {
            case "7":
                t = 0;
                break;
            case "8":
                t = 1;
                break;
            case "9":
                t = 2;
                break;
            case "4":
                t = 3;
                break;
            case "5":
                t = 4;
                break;
            case "6":
                t = 5;
                break;
            case "1":
                t = 6;
                break;
            case "2":
                t = 7;
                break;
            case "3":
                t = 8;
                break;
            default:
                return
        }
        o[t].click()
    }))
}();