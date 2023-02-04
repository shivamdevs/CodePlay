import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import app from '../../app.data';
import { getDisplayDate } from '../../app.functions';
import { LoadSVG } from '../../components/loading/Loading';
import { Link } from 'react-router-dom';
import { getAllCodes, getAllUsers, getCodePlayPreview } from '../../fb.data';
import './Codes.css';
import sortBy from 'sort-by';
import { deleteCode } from '../../fb.code';

function Codes({ user = null, coder = null, path = "/play/", showDeleter = false, showBy = false }) {
    const maxItems = app.maxlength;
    const [codes, setCodes] = useState(null);
    const [queried, setQueried] = useState(null);
    const [filtered, setFiltered] = useState(null);

    const [players, setPlayers] = useState({});

    const [search, setSearch] = useState("");

    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (queried?.length) {
            const endOffset = itemOffset + maxItems;
            setFiltered(queried.slice(itemOffset, endOffset));
            setLoading(false);
        } else {
            setFiltered([]);
        }
        setPageCount(Math.ceil((queried?.length || 0) / maxItems));
    }, [queried, itemOffset, maxItems]);

    useEffect(() => {
        if (codes?.length) {
            let result = [];
            if (search) {
                codes.forEach(code => {
                    if (code.name.toLowerCase().includes(search)) {
                        result.push(code);
                    }
                });
                result = result.sort(sortBy("name"));
            } else {
                result = [...codes];
            }
            setQueried(result);
        }
    }, [codes, search]);

    useEffect(() => {
        if (codes?.length) {
            codes.forEach(async (code, index) => {
                if (!code.image) {
                    update(index, "null");
                    update(index, await getCodePlayPreview(code))
                }
            });
            function update(index, value) {
                setCodes(old => {
                    const list = [...old];
                    list[index].image = value;
                    return list;
                });
            }
        }
    }, [codes]);

    const handlePageClick = (event) => {
        setItemOffset((event.selected * maxItems) % codes.length);
    };

    const getCodes = useCallback(async () => {
        const docs = await getAllCodes(coder);
        if (docs.type === "success") {
            setCodes(docs.data);
        } else {
            setCodes([]);
            toast.error("Failed to get data: " + docs.data);
        }
    }, [coder]);

    const getPlayers = useCallback(async () => {
        const docs = await getAllUsers();
        if (docs.type === "success") {
            setPlayers(docs.data);
        } else {
            setPlayers({});
            toast.error("Failed to get data: " + docs.data);
        }
    }, []);

    useEffect(() => {
        getCodes();
        !coder && getPlayers();
    }, [coder, getPlayers, getCodes]);

    const [deleter, setDeleter] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const deleteStart = async () => {
        setDeleting(true);
        const code = { ...deleter };
        const del = await deleteCode(user, code);
        if (del.type !== "success") {
            toast.error(del.data);
        } else getCodes();
        setDeleter(null);
        setDeleting(false);
    };

    return (
        <>
            <div className="code-search">
                <div className="code-search-box">
                    <i className="far fa-search"></i>
                    <input type="search" className="code-search-input" placeholder="Search..." onChange={({ target }) => setSearch(target.value.trim().toLowerCase())} />
                </div>
            </div>
            <div className="code-viewer">
                {loading && <div className="code-loading"><LoadSVG /></div>}
                {!loading && filtered && filtered.length === 0 && <div className="code-loading">No code found!</div>}
                {filtered && filtered.length > 0 && filtered.map(item => <CodeBlock path={path} showBy={showBy} delta={setDeleter} showDeleter={showDeleter} player={players} user={user} item={item} key={item.id} />)}
                {queried && queried.length > maxItems && <div className="code-navigate-block">
                    <ReactPaginate
                        breakLabel="..."
                        className='code-navigate'
                        nextLabel={<>Next <i className="fas fa-chevron-right"></i></>}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel={<><i className="fas fa-chevron-left"></i> Prev</>}
                        renderOnZeroPageCount={null}
                    />
                </div>}
            </div>
            {deleter !== null && <div className="code-verify">
                <div className="code-verify-center">
                    {!deleting && <>
                        <div className="code-verify-title">Delete code</div>
                        <div className="code-verify-text">{deleter.name} ({deleter.id})</div>
                        <div className="code-verify-text">This code can not be restored unless there exists a clone.</div>
                        <div className="code-verify-option">
                            <button className="bigbutton code-verify-delete" onClick={deleteStart}>Delete</button>
                            <button className="bigbutton" onClick={() => setDeleter(null)}>Cancel</button>
                        </div>
                    </>}
                    {deleting && <>
                        <div className="code-verify-title">Deleting</div>
                        <div className="code-verify-option"><LoadSVG /></div>
                    </>}
                </div>
            </div>}
        </>
    );
};

export default Codes;

function CodeBlock({ item = null, user = null, player = null, path = "/play/", showDeleter = false, showBy = false, delta = null }) {
    const by = player?.[item?.uid] || {};
    return (
        <Link to={`${path}${item.id}`} className={classNames("code-block", { "code-block-item": isMobile })}>
            <img className='skeleton' src={item?.image} alt="" />
            <div className="code-block-name">{item.name}</div>
            {showBy && <div className="code-block-date">Play by: <Link to={`/cp/${by.uid}`} onClick={(e) => e.stopPropagation()}>{by.name}</Link></div>}
            <div className="code-block-date">Updated: {getDisplayDate(item.updated)}</div>
            <div className="code-block-date">Created: {getDisplayDate(item.created)}</div>
            {user?.uid === item?.uid && showDeleter && <button className="code-block-delete roundbutton" onClick={(e) => { e.preventDefault(); delta(item); }}><i className="fas fa-trash"></i></button>}
        </Link>
    );
}