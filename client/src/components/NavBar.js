import React from "react";
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import img1 from './Logo/earth.png'


function NavBar(){

    return (
        <>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
                <img
                    src={img1}
                    width="30"
                    height="30"
                    className="nav-color"
                    alt=""
                />
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Link className='nav-link' to='/' >Home</Link>
                <Link className='nav-link' to='/projects' >Projects</Link>
            </Nav>
        </Navbar>
        </>
    )
}

export default NavBar;