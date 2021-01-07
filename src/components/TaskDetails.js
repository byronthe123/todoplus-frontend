import React, { useEffect, useState, useRef, useContext } from 'react';
import { AppContext } from './Context/index';
import { Row, Col, Input, Button, Form } from 'reactstrap';
import classnames from 'classnames';
import moment from 'moment';
import FileBase64 from 'react-file-base64';
import Attachments from './Attachments';

import Subtask from '../components/Subtask';

export default () => {

    const { projects, tasks, subtasks, actions } = useContext(AppContext);
    const { selectedProject } = projects;
    const { selectedTask, setTaskDueAndReminderDate, createTaskNote, saveAttachments } = tasks;
    const { addSubtask } = subtasks;
    const { handleUpdate, handleUpdateSubtask, markComplete } = actions;

    const [viewCompletedsubtasks, setViewCompletedsubtasks] = useState(false);
    const [addingSubtask, setAddingSubtask] = useState(false);
    const [name, setName] = useState('');

    // Update Tasks
    const [editTask, setEditTask] = useState(false);
    const [updateValue, setUpdateValue] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [reminderDate, setReminderDate] = useState('');

    // Add Note
    const [noteText, setNoteText] = useState('');
    const [addingNote, setAddingNote] = useState(false);

    useEffect(() => {
        setUpdateValue(selectedTask.taskName);
        setDueDate(selectedTask.dueDate ? selectedTask.dueDate : '');
        setReminderDate(selectedTask.reminderDate ? selectedTask.reminderDate : '');
    }, [selectedTask]);

    useEffect(() => {
        if (selectedTask.dueDate !== dueDate && moment(dueDate).isValid()) {
            setTaskDueAndReminderDate(dueDate, selectedTask.projectId, selectedTask._id, false);
        } else if (selectedTask.reminderDate !== reminderDate && moment(reminderDate).isValid()) {
            setTaskDueAndReminderDate(reminderDate, selectedTask.projectId, selectedTask._id, true);
        }
    }, [dueDate, reminderDate]);

    const focusRef = useRef(null);

    useEffect(() => {
        if (editTask) {
            focusRef.current.focus();
        }
    }, [editTask]);

    const enableAddSubtask = () => name.length > 0;

    const handleAddSubtask = async () => {
        const success = await addSubtask(selectedProject._id, selectedTask._id, name);
        if (success) {
            setAddingSubtask(false);
        }
    }

    const enableAddNote = () => noteText.length > 0;

    const handleCreateTaskNote = async (e) => {
        e.preventDefault();
        const result = await createTaskNote(noteText);
        if (result) {
            setAddingNote(false);
            setNoteText('');
        }
    }

    return (
        <>
            {
                selectedTask && 
                <div className='mr-2'>
                    <Row>
                        <Col md={12}>
                            {
                                <h3>Task Details</h3>
                            }
                        </Col>
                    </Row>
                    <div className='task-details-scroll'>
                        <div className='div-subtask-list'>
                            <Row>
                                <Col md={12}>
                                    <h5>Subtasks</h5>
                                    {
                                        selectedTask && selectedTask.subtasks.map((st, i) => !st.completed &&
                                            <Subtask 
                                                subtask={st}
                                                handleUpdateSubtask={handleUpdateSubtask}
                                                key={i}
                                                markComplete={markComplete}
                                                selectedProject={selectedProject}
                                                selectedTask={selectedTask}
                                            />
                                        )
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    {
                                        viewCompletedsubtasks && 
                                        selectedTask.subtasks.map((st, i) => st.completed &&
                                            <Subtask 
                                                subtask={st}
                                                handleUpdateSubtask={handleUpdateSubtask}
                                                key={i}
                                                markComplete={markComplete}
                                                selectedProject={selectedProject}
                                                selectedTask={selectedTask}
                                            />
                                        )
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    {
                                        !addingSubtask ? 
                                            <div>
                                                <i className="fas fa-plus add-subtask" onClick={() => setAddingSubtask(true)}></i>
                                                <span className='buttonless d-flex align-right add-subtask' onClick={() => setViewCompletedsubtasks(!viewCompletedsubtasks)}>{viewCompletedsubtasks ? 'Hide' : 'Show'} Completed Subtasks</span>
                                            </div> : 
                                            <div className='pl-2 pr-4'>
                                                <Input type='textarea' value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                                                <div className='d-flex align-right mt-2'>
                                                    <Button className={classnames('mr-2', {'btn-submit': enableAddSubtask()})} disabled={!enableAddSubtask()} onClick={() => handleAddSubtask()}>Add Subtask</Button>
                                                    <Button color='danger' onClick={() => setAddingSubtask(false)}>Cancel</Button>
                                                </div>
                                            </div>
                                    }
                                </Col>
                            </Row>
                        </div>
                        <Row className='mt-4'>
                            <Col md={12}>
                                <h5>Set Due Date</h5>
                                <Input type='datetime-local' className='mb-2' value={moment(dueDate).format('YYYY-MM-DDTHH:mm')} onChange={(e) => setDueDate(e.target.value)} />
                                <h5>Set Reminder</h5>
                                <Input type='datetime-local' className='mb-2' value={moment(reminderDate).format('YYYY-MM-DDTHH:mm')} onChange={(e) => setReminderDate(e.target.value)} />
                            </Col>
                        </Row>
                        <div className='div-notes-list'>
                            <Row>
                                <Col md={12} className='mt-4'>
                                    <h5>Notes</h5>
                                    <ul className='ul-notes-list'>
                                        {
                                            selectedTask.notes.map((n, i) =>
                                                <li key={i} className='div-edit-note'>
                                                    <span className='float-left'>{n.name}</span>
                                                    <span className='float-right fas fa-edit edit-note' onClick={() => handleUpdate('Note', n.name, n)}></span>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    {
                                        !addingNote ? 
                                            <div>
                                                <i className="fas fa-plus add-note" onClick={() => setAddingNote(true)}></i>
                                            </div> : 
                                            <div className='pl-2 pr-4'>
                                                <Form onSubmit={(e) => handleCreateTaskNote(e)}>
                                                    <Input type='textarea' value={noteText} onChange={(e) => setNoteText(e.target.value)} autoFocus style={{ height: '100px', align: 'top',  }} />
                                                    <div className='d-flex align-right mt-2'>
                                                        <Button className={classnames('mr-2', {'btn-submit': enableAddNote()})} disabled={!enableAddNote()} onClick={(e) => handleCreateTaskNote(e)}>Add Note</Button>
                                                        <Button color='danger' onClick={() => setAddingNote(false)}>Cancel</Button>
                                                    </div>
                                                </Form>
                                            </div>
                                    }
                                </Col>
                            </Row>
                        </div>
                        <Attachments 
                            attachments={selectedTask.attachments}
                            saveAttachments={saveAttachments}
                        />
                    </div>
                </div>
            }
        </>
    );
}