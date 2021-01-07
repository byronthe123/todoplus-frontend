import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import classnames from 'classnames';

export default ({
    subtask,
    handleUpdateSubtask,
    markComplete,
    selectedProject,
    selectedTask
}) => {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <Row className='div-subtask-item'>
            <Col md={12} className={classnames({ 'completed-subtask': subtask.completed })}>
                <span className='float-left'>
                    <i 
                        className={classnames('check-complete-task mr-2 far', 
                            { 'fa-check-circle':  !subtask.completed && isHovered},
                            { 'fa-circle':  !subtask.completed && !isHovered},
                            { 'fa-check-circle': subtask.completed && !isHovered },
                            { 'fa-circle': subtask.completed && isHovered }
                        )}
                        style={{ display: 'inline-block' }} 
                        onMouseOver={() => setIsHovered(true)}
                        onMouseOut={() => setIsHovered(false)}
                        onClick={() => markComplete('subtask', !subtask.completed, selectedProject._id, selectedTask._id, subtask._id)}
                    ></i>
                    <h6 style={{ display: 'inline-block' }}>{subtask.name}</h6>
                </span>
                <span className='float-right'>
                    <i className='fas fa-edit edit-subtask float-right' onClick={() => handleUpdateSubtask('Subtask', subtask.name, subtask)}></i>
                </span>
                {/* <hr className='my-1' /> */}
            </Col>
        </Row>
    );
}