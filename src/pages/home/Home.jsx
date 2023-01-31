import React from 'react';
import { setTitle } from '../../app.functions';
import Swapper from '../../components/swapper/Swapper';
import "./Home.css";

function Home() {
    setTitle("Welcome");
    return (
        <div className="container">
            <h1 className="homerun">
                <Swapper swap={[
                    "Play with your codes...",
                    "Integrate your wishes...",
                    "Design your wings...",
                    "Fulfill your desire...",
                    "Share your dreams...",
                ]} />
            </h1>
            <div className="home-block">
                <div className="home-block-text">
                    <div className="home-block-title">Create new codes</div>
                    <div className="home-block-sub">Use Editor to create your HTML codes while working online and with a live preview.</div>
                </div>
                <div className="home-block-image">
                    <img src="/assets/images/editor.png" alt="" />
                </div>
            </div>
            <div className="home-block">
                <div className="home-block-image">
                    <img src="/assets/images/player.png" alt="" />
                </div>
                <div className="home-block-text">
                    <div className="home-block-title">Create a CodePlay</div>
                    <div className="home-block-sub">Every Code comes with a Play where you can preview your code in a fullscreen.</div>
                </div>
            </div>
            <div className="home-block">
                <div className="home-block-text">
                    <div className="home-block-title">Share your CodePlay</div>
                    <div className="home-block-sub">Every codes that you create will be visible to everyone out there.</div>
                </div>
                <div className="home-block-image">
                    <img src="/assets/images/play.png" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Home;