import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Loading from "./components/Loading";
import Profile from "./views/Profile";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

import Landing from './views/Landing';
import Todos from './views/Todos';
import Stats from './views/Stats';
import StatusBar from './components/StatusBar';
import ModalSetGoal from './components/ModalSetGoal';

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
        <Container fluid className='px-0'>
            {
                isAuthenticated && 
                <StatusBar />
            }
            <Switch>
                <Route exact path='/'>
                    {
                        isAuthenticated ?
                            <Redirect to='/todos' /> :
                            <Landing />
                    }
                </Route>
                <Route path='/todos' component={Todos} />
                <Route path="/profile" component={Profile} />
                <Route path='/stats' component={Stats} />
            </Switch>
            <ModalSetGoal />
            <NotificationContainer />
        </Container>
  );
};

export default App;
