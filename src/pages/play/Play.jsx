import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { getDisplayDate, setTitle } from '../../app.functions';
import { LoadSVG } from '../../components/loading/Loading';
import { getCodePlayPreview, getAllCodes, getCoderData } from '../../fb.data';

function Play() {
    const maxItems = 30;
    setTitle("Play");
    const [codes, setCodes] = useState(null);
    const [current, setCurrent] = useState(null);

    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        if (codes?.length) {
            const endOffset = itemOffset + maxItems;
            setCurrent(codes.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(codes.length / maxItems));
        }
    }, [codes, itemOffset]);

    const handlePageClick = (event) => {
        setItemOffset((event.selected * maxItems) % codes.length);
    };

    const getCodes = useCallback(async () => {
            const docs = await getAllCodes();
            if (docs.type === "success") {
                setCodes(docs.data);
            } else {
                setCodes([]);
                toast.error("Failed to get plays: " + docs.data);
            }
    }, []);
    useEffect(() => {
        getCodes();
    }, [getCodes]);
    return (
        <div className="code-wallet">
            <div className="code-title">
                <div className="code-title-text">Recent Plays</div>
                <div className="code-title-options">
                </div>
            </div>
            <div className="code-viewer">
                {codes === null && <div className="code-loading"><LoadSVG /></div>}
                {codes && codes.length === 0 && <div className="code-loading">No one hase posted any play yet!</div>}
                {codes && codes.length > 0 && current?.length > 0 && current.map(item => <CodeBlock item={item} key={item.id} />)}
                {codes && codes.length > maxItems && <ReactPaginate
                    breakLabel="..."
                    className='code-navigate'
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                />}
            </div>
        </div>
    );
};

export default Play;

function CodeBlock({ item = null }) {
    const [image, setImage] = useState("");
    const [coder, setCoder] = useState({});
    useEffect(() => {
        (async () => {
            setImage(await getCodePlayPreview(item));
            const user = await getCoderData(item.uid);
            setCoder(user.data);
        })();
    }, [item]);
    return (
        <Link to={`/play/${item.id}`} className={classNames("code-block", { "code-block-item": isMobile })}>
            <img className='skeleton' src={image} alt="" />
            <div className="code-block-name">{item.name}</div>
            <div className="code-block-date">Play by: {coder?.name}</div>
            <div className="code-block-date">Updated: {getDisplayDate(item.updated)}</div>
            <div className="code-block-date">Created: {getDisplayDate(item.created)}</div>
        </Link>
    );
}