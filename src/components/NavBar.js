import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavLink } from 'reactstrap';
import { NavLink as RouterNavLink } from "react-router-dom";

export default ({
    
}) => {

    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
    } = useAuth0();

    const logoutWithRedirect = () =>
        logout({
        returnTo: window.location.origin,
        });

    const [dropdownOpen, setOpen] = useState(false);

    const toggle = () => setOpen(!dropdownOpen);

    return (
        <div className='nav d-flex flex-row-reverse'>
            <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                {
                    isAuthenticated &&
                    <>
                        <DropdownToggle caret>
                            {user.name}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>
                                <NavLink
                                    tag={RouterNavLink}
                                    to={'/todos'}
                                    activeClassName="router-link-exact-active"
                                >
                                    To Dos
                                </NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink
                                    tag={RouterNavLink}
                                    to={'/stats'}
                                    activeClassName="router-link-exact-active"
                                >
                                    Stats
                                </NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink 
                                    tag={RouterNavLink}
                                    to={''}
                                    activeClassName="router-link-exact-active"
                                    onClick={() => logoutWithRedirect()}
                                > 
                                    Logout
                                </NavLink>
                            </DropdownItem>
                        </DropdownMenu>
                    </>
                }
            </ButtonDropdown>
        </div>
    );
}