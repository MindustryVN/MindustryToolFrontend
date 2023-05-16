import React from 'react';

import './Home.css';

const Home = () => {
    return (
        <div className='home'>
            <span className='content'>
                <h2>What are you looking for?</h2>
                <b>Download the game for free?</b>
                <ul>
                    <li>
                        <a className='link' href='https://anuke.itch.io/mindustry?fbclid=IwAR2HgdkixMrQEDhcj1an_qtWnnq6YmOlm-c8VoyPsNp5bMtu5aWq_ff7K2M' target='_blank' rel='noopener noreferrer'>
                            Itch.io
                        </a>
                    </li>
                </ul>
                <b>Want to play with others mindustry player?</b>
                <ul className='link-container'>
                    <li>
                        <a className='link' href='https://discord.gg/mindustry' target='_blank' rel='noopener noreferrer'>
                            Mindustry Official Discord Server
                        </a>
                    </li>
                    <li>
                        <a className='link' href='https://discord.gg/DCX5yrRUyp' target='_blank' rel='noopener noreferrer'>
                            Mindustry Discord Server For Vietnamese
                        </a>
                    </li>
                    <li>
                        <a className='link' href='https://www.reddit.com/r/Mindustry' target='_blank' rel='noopener noreferrer'>
                            Reddit r/Mindustry
                        </a>
                    </li>
                </ul>
                <br />
                <b>Looking for schematic?</b>
                <ul>
                    <li>
                        <a className='link' href='/schematic'>
                            Go to schematic page
                        </a>
                    </li>
                </ul>
                <br />
                <b>Looking for map?</b>
                <ul>
                    <li>
                        <a className='link' href='/map'>
                            Go to map page
                        </a>
                    </li>
                </ul>
                <br />
                <b>Looking for processor logic?</b>
                <ul>
                    <li>
                        <a className='link' href='/logic'>
                            Go to logic page
                        </a>
                    </li>
                </ul>
            </span>
        </div>
    );
};

export default Home;
