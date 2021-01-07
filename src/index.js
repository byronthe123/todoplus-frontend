import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from "@auth0/auth0-react";
import config from "./auth_config.json";
import history from './utils/history';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import ReminderNotification from './components/ReminderNotification';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Card, CardBody, Row, Col } from 'reactstrap';

import Provider from './components/Context/index';

const onRedirectCallback = (appState) => {
    history.push(
        appState && appState.returnTo
            ? appState.returnTo
            : window.location.pathname
    );
};

  ReactDOM.render(
      <BrowserRouter history={history}>
            <Auth0Provider
                domain={config.domain}
                clientId={config.clientId}
                audience={config.audience}
                redirectUri={window.location.origin}
                onRedirectCallback={onRedirectCallback}
            >
                <ToastProvider components={{ Toast: ReminderNotification }}>
                    <Provider>
                        <App />
                    </Provider>
                </ToastProvider>
            </Auth0Provider>
      </BrowserRouter>,
    document.getElementById("root")
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
