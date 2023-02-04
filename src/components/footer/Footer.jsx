import React from 'react';
import { Link } from 'react-router-dom';
import app from '../../app.data';
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-column">
                <Link to="/" className="footer-flex footer-link">
                    <div className="header-image">
                        <img src="/logo.png" alt="" />
                    </div>
                    <div className="header-text">CodePlay</div>
                </Link>
                <div className="footer-version">Version: {app.version} Build: {app.build}</div>
            </div>
            <div className="footer-flex-grow">
                <div className="footer-links">
                    <div className="footer-column">
                        <Link to="/play" className="footer-link">Recent Plays</Link>
                        <Link to="/accounts" className="footer-link">Get Started</Link>
                        <a href="/code/new" className="footer-link">Create code</a>
                    </div>
                    <div className="footer-column">
                        <a target="_blank" href="https://myoasis.tech/legal" className="footer-link" rel="noreferrer">Privacy</a>
                        <a target="_blank" href="https://myoasis.tech/legal/terms" className="footer-link" rel="noreferrer">Terms</a>
                        <a target="_blank" href="https://myoasis.tech/legal/cookies" className="footer-link" rel="noreferrer">Cookies</a>
                    </div>
                    <div className="footer-column">
                        <Link to="/support" className="footer-link">Support</Link>
                        <Link to="/support/report" className="footer-link">Report</Link>
                        <Link to="/support/request" className="footer-link">Request</Link>
                    </div>
                    <div className="footer-column">
                        <Link to="/about" className="footer-link">About us</Link>
                        <Link to="/about/players" className="footer-link">Players</Link>
                        <Link to="/support/contact" className="footer-link">Contact us</Link>
                    </div>
                </div>
                <div className="footer-notes">
                    <div>{app.parent} @2023-{new Date().getFullYear()}</div>
                    <div>{app.location}</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;