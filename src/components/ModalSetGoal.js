import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../components/Context/index';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input } from 'reactstrap';
import moment from 'moment';
import classnames from 'classnames';

export default () => {

    const { goals } = useContext(AppContext);

    const {
        modalSetGoalsOpen,
        setModalSetGoalsOpen,
        workTimeAvailable,
        goalTypeToday,
        enforceSetGoal,
        switchSetGoal,
        goalSuggestion
    } = goals;

    const handleToggle = () => !enforceSetGoal && setModalSetGoalsOpen(!modalSetGoalsOpen);

    const [hours, setHours] = useState('');
    const [min, setMin] = useState('');
    const [message, setMessage] = useState('');
    const [enableSetGoal, setEnableSetGoal] = useState(false);
    const [goalSeconds, setGoalSeconds] = useState(0);

    useEffect(() => {
        setHours('');
        setMin('');
    }, [modalSetGoalsOpen, goalTypeToday]);

    const checkNaNorZero = (value) => {
        if(parseInt(value) === 0 || isNaN(parseInt(value))) {
            return true;
        }
        return false;
    }

    const goalTimeToSeconds = (hours, min) => {
        const hoursDelta = 
            isNaN(parseInt(hours)) ? 
                0 : parseInt(hours);

        const minuteDelta = 
            isNaN(parseInt(min)) ? 
                0 : parseInt(min);

        const hoursToSeconds = (hoursDelta * 60 * 60);
        const minutesToSeconds = (minuteDelta * 60);
        const seconds = hoursToSeconds + minutesToSeconds;

        return seconds;
    } 

    const validateGoalTime = () => {
        if (goalTypeToday) {
            const eod = moment().hour(24).minute(0).second(0);
            const nowPlusGoalTime = moment().add({ hours: hours, minutes: min});
            const overTimeGoal = nowPlusGoalTime.isAfter(eod);
            const noGoalTime = (checkNaNorZero(hours) && checkNaNorZero(min)) ? true : false;
    
            if(overTimeGoal) {
                return 1;
            } else if(noGoalTime) {
                return -1;
            } else {
                return 0;
            }
        } else {
            const seconds = goalTimeToSeconds(hours, min);
            if (seconds > 201600) {
                return 1;
            } else if (seconds < 1) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    useEffect(() => {
        const validationResult = validateGoalTime();
        if (validationResult === 0) {
            setEnableSetGoal(true);
            setMessage('');
            const seconds = goalTimeToSeconds(hours, min);
            setGoalSeconds(seconds);
        } else {
            setEnableSetGoal(false);
            if (validationResult === 1) {
                if (goalTypeToday) {
                    setMessage('Goal time cannot exceed time left in the day.');
                } else {
                    setMessage('Current maximum weekly goal cannot be more than 56 hours.');
                }
            } else {
                if (hours.length > 0 || min.length > 0) {
                    setMessage('Goal time cannot be 0.');
                }
            }
        }
        
    }, [hours, min]);


    return (
        <Modal isOpen={modalSetGoalsOpen} toggle={handleToggle}>
            <ModalHeader>Set Productivity Goal for { goalTypeToday ? 'Today' : 'the Week' }</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={12}>
                        <Row>
                            <Col md={12}>
                                <h1>{workTimeAvailable}</h1>
                            </Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col md={12}>
                                <Input type='number' value={hours} min='0' max='18' placeholder='HH' onChange={(e) => setHours(e.target.value)} style={{ width: '70px', display: 'inline-block'}} className='mx-1' /> :
                                <Input type='number' value={min} min='0' max='59' placeholder='MM' onChange={(e) => setMin(e.target.value)} style={{ width: '70px', display: 'inline-block' }} className='mx-1' /> :
                                <Input disabled type='number' placeholder='SS' style={{ width: '70px', display: 'inline-block' }} className='mx-1' />
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col md={12}>
                                <h6>{ message }</h6>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Row style={{ width: '100%' }}>
                    <Col md={12} className='pl-0'>
                        {
                            goalTypeToday && 
                            <div className='float-left'>
                                <h6>Suggestion to meet weekly goal: {goalSuggestion}</h6>
                            </div>
                        }
                        <div className='float-right'>
                            <Button 
                                color="secondary" 
                                className={classnames({ 'btn-submit': enableSetGoal })} 
                                disabled={!enableSetGoal}
                                onClick={() => switchSetGoal(goalSeconds)}
                            >
                                Set Goal
                            </Button>
                        </div>
                    </Col>
                </Row>
                {/* <Button color="secondary" onClick={toggle}>Cancel</Button> */}
            </ModalFooter>
        </Modal>
    );
}
