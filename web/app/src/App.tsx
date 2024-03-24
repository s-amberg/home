import './App.css';
import './scss/main.scss';
import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import { AppRoutes } from './Routes';
import { useEffect, useState } from 'react';
import { MDBCollapse, MDBContainer, MDBIcon, MDBNavbar, MDBNavbarBrand, MDBNavbarItem, MDBNavbarLink, MDBNavbarNav, MDBNavbarToggler } from 'mdb-react-ui-kit';
import React from 'react';


function App() {

  const NavBar = () => {

    const [pathName, setPathName] = useState<string|undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);
    let location = useLocation();
    useEffect(() => {
      setPathName(location.pathname);
    }, [location]);

    const toggle = () => setIsOpen(!isOpen);
    return (
          <MDBNavbar expand="md" light bgColor='light' className="mb-4" sticky>
            <MDBContainer fluid>

              <MDBNavbarBrand tag={Link} to="/">
                Home
              </MDBNavbarBrand>
              <MDBNavbarToggler 
                aria-controls='navbarSupportedContent'
                aria-expanded='false'
                aria-label='Toggle navigation'
                onClick={toggle}><MDBIcon icon='bars' fas /></MDBNavbarToggler>
            
              <MDBCollapse open={isOpen} navbar>
                <MDBNavbarNav left>
                  <MDBNavbarItem>
                    <MDBNavbarLink
                      tag={Link}
                      active={pathName === "/connector"}
                      to={"/connector"}
                    >
                      DB Connector
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink
                      tag={Link}
                      active={pathName === "/todos"}
                      to={"/todos"}
                    >
                      Todos
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                </MDBNavbarNav>
                <MDBNavbarNav right fullWidth={false}>
                  <MDBNavbarItem>
                    <MDBNavbarLink tag={Link} to="/" onClick={() => {}}>
                      Logout
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                </MDBNavbarNav>
              </MDBCollapse>
            </MDBContainer>
          </MDBNavbar>
    )
  }


  return (
    <MDBContainer fluid className="bg-image app-bg-image">
      
      <BrowserRouter basename="/app">
        <NavBar></NavBar>
        <AppRoutes/>
      </BrowserRouter>

    </MDBContainer>
  );
}

export default App;
