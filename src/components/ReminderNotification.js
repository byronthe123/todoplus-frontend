import React, { useState,  } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { Animated } from "react-animated-css";
import ReactTooltip from 'react-tooltip';
import img from '../assets/snooze-bell.png'
import moment from 'moment';
import { useHistory } from "react-router-dom";

export default ({ appearance, children, onDismiss, project, task, setSelectedProject, setSelectedTask, setTaskDueAndReminderDate }) => {

    const history = useHistory();
    const [visible, setVisible] = useState(true);
    const handleDismiss = (onDismiss) => {
        setVisible(false);
        onDismiss()
    }

    return (
        <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={visible} animationInDuration={300} className='mb-1'>
            <ReactTooltip />
            <Card className='px-1 py-1' style={{ width: '600px' }} className='notification-card'>
                <CardBody className='py-1'> 
                    <Row>
                        <Col md={1} className='text-center d-flex align-items-center'>
                            {/* <i className="far fa-bell ml-1" data-tip='Snooze for 5 minutes'></i> */}
                            <img 
                                className='snooze-notification' 
                                data-tip='Snooze for 5 minutes' 
                                src={img} 
                                style={{ width: '20px', height: 'auto' }} 
                                onClick={() => {
                                    setTaskDueAndReminderDate(moment().add(5, 'minute').format('MM/DD/YYYY HH:mm'), project._id, task._id, true, true);
                                    handleDismiss(onDismiss);
                                }}
                            />
                        </Col>
                        <Col 
                            md={10} 
                            className='d-flex align-items-center notification-body'
                            onClick={() => {
                                history.push('/todos');
                                setSelectedProject(project);
                                setSelectedTask(task);
                                handleDismiss(onDismiss);
                            }}
                        >
                            {children}
                        </Col>
                        <Col md={1} className='text-center'>
                            <Row>
                                <Col md={12} className='text-center d-flex align-items-center'>
                                    <i className="fas fa-times mt-1" onClick={() => handleDismiss(onDismiss)}></i>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Animated>
        
    );
}