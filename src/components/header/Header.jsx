import React, { useEffect, useRef } from 'react';
import './Header.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../fb.user';
import { ContextMenuTrigger, ContextMenu, ContextMenuItem } from 'myoasis-contextmenu';
import 'myoasis-contextmenu/contextmenu.css';

function Header({ user = null }) {
    const header = useRef();
    const openheader = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        document.addEventListener("scroll", () => {
            if (header.current) {
                if (document.body.getBoundingClientRect().top < -10) {
                    header.current.classList.add("header-active");
                } else {
                    header.current.classList.remove("header-active");
                }
            }
        });
    }, []);
    return (
        <header className="header header-sticky" ref={header}>
            <button onClick={() => header.current.classList.add("header-open")} className="roundbutton mobile-visible"><i className="fas fa-bars"></i></button>
            <Link to="/" className="header-link header-flex">
                <div className="header-image">
                    <img src="/logo.png" alt="" />
                </div>
                <div className="header-text">CodePlay</div>
            </Link>
            <div className="header-button-container" ref={openheader} onClick={(e) => header.current.classList.remove("header-open")}>
                <div className="header-buttons">
                    <div className="mobile-visible header-flex">
                        <button className="roundbutton"><i className="fas fa-chevron-left"></i></button>
                        <Link to="/" className="header-link header-flex">
                            <div className="header-image">
                                <img src="/logo.png" alt="" />
                            </div>
                            <div className="header-text">CodePlay</div>
                        </Link>
                    </div>
                    <NavLink className="header-button" to="/">Home</NavLink>
                    {user && <NavLink className="header-button" to="/cp">Dashboard</NavLink>}
                    <NavLink className="header-button" to="/play">Plays</NavLink>
                    <NavLink className="header-button" to="/code">Code</NavLink>
                    {/* <NavLink className="header-button" to="/support">Support</NavLink> */}
                    {!user && <Link to="/accounts/" className="mobile-visible bigbutton">Get started</Link>}
                    {user && <button className="mobile-visible bigbutton" onClick={logout}>Logout</button>}
                </div>
            </div>
            {!user && <Link to="/accounts" className="roundbutton mobile-visible"><i className="fas fa-user"></i></Link>}
            {!user && <Link to="/accounts" className="mobile-hidden bigbutton">Get started</Link>}
            {user && <>
                <ContextMenuTrigger trigger='click' exact={false} menu="profile-menu" className="roundbutton header-photo"><img src={user.photoURL} alt="" /></ContextMenuTrigger>
                <ContextMenu className="contextmenu"  menu="profile-menu">
                    <ContextMenuItem className="contextmenuitem" onClick={(data) => navigate(`/cp`)}><i className="fas fa-fw fa-user"></i><span>CodePlay Dashboard</span></ContextMenuItem>
                    <ContextMenuItem className="contextmenuitem" onClick={(data) => navigate(`/accounts/profile`)}><i className="fas fa-fw fa-user-pen"></i><span>Edit public profile</span></ContextMenuItem>
                    <ContextMenuItem  className="contextmenuitem" onClick={logout}><i className="fas fa-fw fa-power-off"></i><span>Logout</span></ContextMenuItem>
                </ContextMenu>
            </>}
        </header>
    );
};

export default Header;