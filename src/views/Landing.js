import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import history from "../utils/history";

export default () => {

    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
    } = useAuth0();   
    
    if (isAuthenticated) {
        history.push('/todos');
    }

    return (
        <div className='home d-flex justify-content-center'>
            <div className='sub-home'></div>
            <div className='login d-flex justify-content-center'>
                <button onClick={() => loginWithRedirect()} className="btn btn-secondary btn-login" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Sign in
                </button>
            </div>        
        </div>
    );
}