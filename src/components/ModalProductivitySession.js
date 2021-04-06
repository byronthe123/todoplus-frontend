import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './Context/index';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { XYPlot, ArcSeries } from "react-vis";
import classnames from 'classnames';
import Timer from "easytimer.js";

export default () => {

    const { goals, tasks } = useContext(AppContext);
    const { timeFormatter, modalSessionOpen, setModalSessionOpen, createProductivityEntry } = goals;
    const { selectedTask } = tasks;
    const [started, setStarted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [exec, setExec] = useState(false);
    const [timer, setTimer] = useState(new Timer());
    const totalSeconds = 1500;

    const toggle = () => setModalSessionOpen(!modalSessionOpen);

    useEffect(() => {
        timer.reset();
        timer.stop();
        setStarted(false);
        setIsRunning(false);

        if (modalSessionOpen) {
            setExec(false);
        }
    }, [modalSessionOpen]);

    const handleTimer = () => {
        if (isRunning) {
            setIsRunning(false);
            timer.pause();
        } else {
            setStarted(true);
            setIsRunning(true);
            timer.start({countdown: true, startValues: { seconds: totalSeconds }});
        }
    }

    useEffect(() => {
        if (exec) {
            createProductivityEntry();
            toggle();
        }
    }, [exec]);

    timer.addEventListener('targetAchieved', function (e) {
        timer.stop();
        setExec(true);
    });

    return (
        <div>
            <Modal isOpen={modalSessionOpen}>
                <ModalHeader>
                    Productivity Session:
                    <p className='productivity-modal-sub'><i className='fas fa-circle pr-2' style={{ fontSize: '10px' }} />{selectedTask && selectedTask.name}</p>
                </ModalHeader>
                <ModalBody className='py-0'>
                    <Row>
                        <Col md={12} className='text-center'>
                            {
                                started ? 
                                    <h1 className='productivity-session-timer'>{timeFormatter(timer.getTotalTimeValues().seconds)}</h1>
                                    : 
                                    <h1 className='productivity-session-timer'>25:00</h1>
                            }
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
                                        total: ((totalSeconds -  (started ? timer.getTotalTimeValues().seconds : 1500)) / totalSeconds) * 6.3,
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
                    <Button className={classnames(isRunning ? 'btn-secondary' : 'btn-submit')} onClick={() => handleTimer()}>
                        {
                            isRunning ? 'Pause' : 'Start'
                        }
                    </Button>
                    <Button color="danger" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}