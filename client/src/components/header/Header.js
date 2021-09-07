import React from 'react';

//asset imports
import GithubIcon from '../../assets/imgs/github.svg';
import GithubHoverIcon from '../../assets/imgs/github-alt.svg';

const handleMouseOver = (e) => {
    e.currentTarget.src = GithubHoverIcon;
}

const handleMouseLeave = (e) => {
    e.currentTarget.src = GithubIcon;
}

function Header() {
    return (
        <header className="header__wrapper">
            <div className="header-title__wrapper">
            <h1 className="header-title">URL Shortener</h1>
            </div>
            <div className="header-links__wrapper">
            <h1 className="header-links">Active Links</h1>
            <a href="https://github.com/joshleecodes/url-shortener" target="_blank">
                <img 
                className="header-github"
                src={GithubIcon}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                />              
            </a>
            </div>
        </header>
    )
}

export default Header;

