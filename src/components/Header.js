import React from "react";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Header() {

    
    return (
        <header className="header">
            <span className="header--help" onClick={() => console.log("Help Clicked!")}>
                <HelpOutlineIcon />
            </span>

            <h1 className="header--title">Wordle</h1>
            <a className="header--github" href="http://www.github.com/krawaller/swordle" title="Github">
                <GitHubIcon />
            </a>
        </header>
    )
}