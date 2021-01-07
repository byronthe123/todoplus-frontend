import React, { useState, useEffect } from 'react';
import { Card, CardBody } from 'reactstrap';
import classnames from 'classnames';

export default ({
    task,
    selectedTask,
    setSelectedTask,
    handleUpdate,
    setModalSessionOpen,
    markComplete,
    selectedProject
}) => {

    const [isHovered, setIsHovered] = useState(false);
    const isSelectedTask = () => {
        if (selectedTask) {
            return selectedTask._id === task._id;
        }
        return false;
    };

    return (
        <Card 
            onClick={() => setSelectedTask(task)} 
            className={classnames('mb-2', task.completed ? 'completed-task-card' : 'task-card')}
        >
            <CardBody className={classnames('div-task py-1', {'selected-task': isSelectedTask()})}>
                <i 
                    className={classnames('check-complete-task mr-2 far', 
                        { 'fa-check-circle':  !task.completed && isHovered},
                        { 'fa-circle':  !task.completed && !isHovered},
                        { 'fa-check-circle': task.completed && !isHovered },
                        { 'fa-circle': task.completed && isHovered }
                    )}
                    style={{ display: 'inline-block' }} 
                    onMouseOver={() => setIsHovered(true)}
                    onMouseOut={() => setIsHovered(false)}
                    onClick={() => markComplete('task', !task.completed, selectedProject._id, task._id)}
                ></i>
                <h5 className='mt-2' style={{ display: 'inline-block' }}>{task.name}</h5>
                {
                    isSelectedTask() && 
                    <div className='float-right mt-2 show-on-hover-tasks'>
                        <i className='fas fa-edit mr-2 focus-hover' onClick={() => handleUpdate('Task', task.name)} />
                        <i className='fas fa-hourglass-half focus-hover' onClick={() => setModalSessionOpen(true)} />
                    </div>
                }
            </CardBody>
        </Card>
    );
}