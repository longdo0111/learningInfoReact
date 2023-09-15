import React from 'react'

function HeaderComponent() {
    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div><a className="navbar-brand" href='/'>Home</a></div>
                    <div><a className="navbar-brand" href='/wfd'>Write from Dictation</a></div>
                </nav>
            </header>
        </div>
    )
}
export default HeaderComponent