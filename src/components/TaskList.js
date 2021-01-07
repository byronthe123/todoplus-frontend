import React, { useState, useContext } from 'react';
import { Row, Col, Button, Input, Form } from 'reactstrap';
import classnames from 'classnames';
import { AppContext } from '../components/Context/index';
import Task from './Task';
import ModalUpdate from './ModalUpdate';

export default () => {

    const { projects, tasks, actions, goals, modalUpdate } = useContext(AppContext); 
    const { selectedProject } = projects;
    const {
        selectedTask,
        setSelectedTask,
        addTask
    } = tasks;
    const { handleUpdate, markComplete } = actions;
    const { setModalSessionOpen } = goals;

    const [viewCompletedTasks, setViewCompletedTasks] = useState(false);
    const [addingTask, setAddingTask] = useState(false);
    const [name, setName] = useState('');
    const enableAddTask = () => name.length > 0;

    const handleAddTask = async (e) => {
        e.preventDefault();
        const success = await addTask(selectedProject._id, name);
        console.log(success);
        if (success) {
            setAddingTask(false);
            setName('');
        }
    }

    return (
        <>
            <Row className='task-subtitle'>
                <Col md={12}>
                {
                    selectedProject ? 
                    <h3>Tasks for {selectedProject.name}</h3> :
                    <h3>Tasks</h3>
                }
                </Col>
            </Row>
            <Row className='full-height'>
                {
                    selectedProject && selectedProject.tasks ? 
                        <div className='full-width div-tasks-list'>
                            <div className={classnames('active-tasks pl-2 py-2', `${selectedTask ? 'pr-2' : 'pr-4'}`)}>
                                {
                                    selectedProject.tasks.map((t, i) => !t.completed &&
                                        <Task 
                                            key={i}
                                            task={t}
                                            selectedTask={selectedTask}
                                            setSelectedTask={setSelectedTask}
                                            handleUpdate={handleUpdate}
                                            setModalSessionOpen={setModalSessionOpen}
                                            markComplete={markComplete}
                                            selectedProject={selectedProject}
                                        />
                                    )
                                }
                            </div>
                            {
                                viewCompletedTasks && 
                                <div className='completed-tasks pl-2'>
                                    {
                                        selectedProject.tasks.map((t, i) => t.completed &&
                                            <Task 
                                                key={i}
                                                task={t}
                                                selectedTask={selectedTask}
                                                setSelectedTask={setSelectedTask}
                                                markComplete={markComplete}
                                                selectedProject={selectedProject}
                                            />
                                        )
                                    }
                                </div>
                            }
                            {
                                !addingTask ? 
                                    <div className='pl-3 pr-4'>
                                        <i className="fas fa-plus add-task" onClick={() => setAddingTask(true)}></i>
                                        <span className='buttonless d-flex align-right add-task' onClick={() => setViewCompletedTasks(!viewCompletedTasks)}>{viewCompletedTasks ? 'Hide' : 'Show'} Completed Tasks</span>
                                    </div> : 
                                    <div className='pl-2 pr-4'>
                                        <Form onSubmit={(e) => handleAddTask(e)}>
                                            <Input type='text' value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                                            <div className='d-flex align-right mt-2'>
                                                <Button className={`mr-2 ${enableAddTask() && 'btn-submit'}`} disabled={!enableAddTask()} onClick={(e) => handleAddTask(e)}>Confirm</Button>
                                                <Button color='danger' onClick={() => setAddingTask(false)}>Cancel</Button>
                                            </div>
                                        </Form>
                                    </div>
                            }
                        </div> : 
                        <div className='taskdiv-logo'></div>
                }
            </Row>
        </>

    );
}