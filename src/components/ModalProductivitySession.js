import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './Context/index';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { XYPlot, ArcSeries } from "react-vis";
import classnames from 'classnames';

export default () => {

    const { goals, tasks } = useContext(AppContext);
    const { timeFormatter, modalSessionOpen, setModalSessionOpen, createProductivityEntry } = goals;
    const { selectedTask } = tasks;
    const [isRunning, setIsRunning] = useState(false);
    const [totalSeconds, setTotalSeconds] = useState(1500);
    const [seconds, setSeconds] = useState(1500);

    const toggle = () => setModalSessionOpen(!modalSessionOpen);

    useEffect(() => {
        setTotalSeconds(1500);
        setSeconds(1500);
        setIsRunning(false);
    }, [modalSessionOpen]);

    useEffect(() => {
        if (isRunning && seconds > 0) {
            setTimeout(() => {
                setSeconds(seconds - 1);
            }, 1000);
        }
        if (seconds === 0) {
            createProductivityEntry();
            toggle();
        }
    }, [isRunning, seconds]);

    return (
        <div>
            <Modal isOpen={modalSessionOpen}>
                <ModalHeader>
                    Productivity Session:
                    <p className='productivity-modal-sub'><i className='fas fa-circle pr-2' style={{ fontSize: '10px' }} />{selectedTask && selectedTask.name}</p>
                </ModalHeader>
                <ModalBody className='py-0'>
                    <Row>
                        <Col md={12} className='stext-center'>
                            <h1 className='productivity-session-timer'>{timeFormatter(seconds)}</h1>
                            <XYPlot
                                xDomain={[-3, 3]}
                                yDomain={[-3, 3]}
                                width={300}
                                getAngle={d => d.total} //this refers to the total data
                                getAngle0={d => 0}
                                height={300}
                                className='timer-modal-graph'
                            >
                                <ArcSeries
                                    animation={{
                                        damping: 9,
                                        stiffness: 300
                                    }}
                                    style={{
                                        // stroke: "black", //specify stroke here
                                        strokeWidth: 2
                                    }}
                                    radiusDomain={[0, 3]}
                                    data={[
                                    { total: totalSeconds, radius0: 2, radius: 2.5, color: "#b5b5b7" },
                                    {
                                        total: ((totalSeconds - seconds) / totalSeconds) * 6.3,
                                        radius0: 2,
                                        radius: 2.5,
                                        color: "#f2b632"
                                    }
                                    ]}
                                    colorType={"literal"}
                                />
                            </XYPlot>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button className={classnames(isRunning ? 'btn-secondary' : 'btn-submit')} onClick={() => setIsRunning(!isRunning)}>
                        {
                            isRunning ? 'Pause' : 'Start'
                        }
                    </Button>{' '}
                    <Button color="danger" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}