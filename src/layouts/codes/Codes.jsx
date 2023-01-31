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

function Codes({user = null, coder = null}) {
    const maxItems = app.maxlength;
    const [codes, setCodes] = useState(null);
    const [queried, setQueried] = useState(null);
    const [filtered, setFiltered] = useState(null);

    const [players, setPlayers] = useState({});

    const [search, setSearch] = useState("");

    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        if (queried?.length) {
            const endOffset = itemOffset + maxItems;
            setFiltered(queried.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(queried.length / maxItems));
        } else {
            setFiltered([]);
        }
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
    return (
        <>
            <div className="code-search">
                <div className="code-search-box">
                    <i className="far fa-search"></i>
                    <input type="search" className="code-search-input" placeholder="Search..." onChange={({target}) => setSearch(target.value.trim().toLowerCase())} />
                </div>
            </div>
            <div className="code-viewer">
                {filtered === null && <div className="code-loading"><LoadSVG /></div>}
                {filtered && filtered.length === 0 && <div className="code-loading">No code found!</div>}
                {filtered && filtered.length > 0 && filtered.map(item => <CodeBlock player={players} user={user} item={item} key={item.id} />)}
                {queried && queried.length > maxItems && <ReactPaginate
                    breakLabel="..."
                    className='code-navigate'
                    nextLabel={<>Next <i className="fas fa-chevron-right"></i></>}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel={<><i className="fas fa-chevron-left"></i> Prev</>}
                    renderOnZeroPageCount={null}
                />}
            </div>
        </>
    );
};

export default Codes;

function CodeBlock({ item = null, player= null }) {
    return (
        <Link to={`/play/${item.id}`} className={classNames("code-block", { "code-block-item": isMobile })}>
            <img className='skeleton' src={item?.image} alt="" />
            <div className="code-block-name">{item.name}</div>
            <div className="code-block-date">Play by: {player?.[item.uid]?.name}</div>
            <div className="code-block-date">Updated: {getDisplayDate(item.updated)}</div>
            <div className="code-block-date">Created: {getDisplayDate(item.created)}</div>
        </Link>
    );
}