import React from 'react';

function logout(event) {
    window.location.replace('/logout')
}

function NavBar({user}) {
    return <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a className="navbar-brand" href="/">QuoteBook Assistant</a>
        <button onClick={logout} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            Logout
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <a className="nav-link" href="/logout">Logout of <span className="text-white">{user.email}</span></a>
                </li>
            </ul>
        </div>
    </nav>
}

export default NavBar;