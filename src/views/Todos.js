import React, { useContext, useEffect } from 'react';
import { AppContext } from '../components/Context/index';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Row, Col } from "reactstrap";

import Loading from "../components/Loading";
import StatusBar from '../components/StatusBar';
import ProjectList from '../components/ProjectList';
import TaskList from '../components/TaskList';
import TaskDetails from '../components/TaskDetails';
import ModalUpdate from '../components/ModalUpdate';
import ModalProductivitySession from '../components/ModalProductivitySession';

export const Todos = ({
    
}) => {
    
    const { tasks, actions } = useContext(AppContext);
    const { selectedTask } = tasks;

    const { createReminderNotification } = actions;

    return (
        <Row>
            <Col md={12}>
                {/* <h1 onClick={() => createReminderNotification()}>test</h1> */}
                <Row className='main-row'>
                    <Col md={2} className='div-projects'>
                        <ProjectList />
                    </Col>
                    <Col md={selectedTask ? 8 : 10} id='tasks'>
                        <TaskList />
                    </Col>
                    {
                        selectedTask && 
                        <Col md={2} className='col-subtask-list'>
                            <TaskDetails />
                        </Col>
                    }
                </Row>
            </Col>
            <ModalUpdate />
            <ModalProductivitySession />
        </Row>
    );
}

export default withAuthenticationRequired(Todos, {
    onRedirecting: () => <Loading />
});