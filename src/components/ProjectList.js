import React, { useState, useContext } from 'react';
import { Row, Col, Button, Input, Form } from 'reactstrap';
import { AppContext } from '../components/Context/index';

import Project from './Project';

export default () => {

    const { projects, actions } = useContext(AppContext);
    const {
        projectsList,
        addProject,
        selectedProject,
        setSelectedProject
    } = projects;

    const { handleUpdate, markComplete } = actions;

    const [viewCompletedProjects, setViewCompletedProjects] = useState(false);
    const [addingProject, setAddingProject] = useState(false);
    const [projectName, setProjectName] = useState('');

    const enableAddProject = () => projectName.length > 0;

    const handleAddProject = async (e) => {
        e.preventDefault();
        const success = await addProject(projectName);
        if (success) {
            setAddingProject(false);
            setProjectName('');
        }
    }

    return (
        <div className='div-project-list full-height'>
            <Row className='subtitle'>
                <Col md={12} className='pl-4'>
                    <h3>Projects:</h3>
                </Col>
            </Row>
            <Row className='row-projects-list'>
                <Col md={12} className='pr-1'>
                    <div className='full-width ml-2'>
                        <div className='active-projects'>
                            {
                                projectsList && projectsList.map((project, i) => !project.completed && 
                                    <Project
                                        key={i}
                                        project={project}
                                        selectedProject={selectedProject}
                                        setSelectedProject={setSelectedProject} 
                                        handleUpdate={handleUpdate}
                                        markComplete={markComplete}
                                    />
                                )
                            }
                        </div>
                        <div className={`completed-projects ${!viewCompletedProjects ? 'hidden' : null}`}>
                            {
                                projectsList && projectsList.map((project, i) => project.completed && 
                                    <Project
                                        key={i}
                                        project={project}
                                        selectedProject={selectedProject}
                                        setSelectedProject={setSelectedProject} 
                                        handleUpdate={handleUpdate}
                                        markComplete={markComplete}
                                    />
                                )
                            }
                        </div>
                        {
                            addingProject && 
                            <Form onSubmit={(e) => handleAddProject(e)} style={{ width: '96%' }}>
                                <Input type='text' value={projectName} onChange={(e) => setProjectName(e.target.value)} autoFocus={true} />
                            </Form>
                        }
                        {
                            addingProject ?
                                <div className='d-flex align-right mt-2'>
                                    <Button className={`mr-2 ${enableAddProject() && 'btn-submit'}`} disabled={!enableAddProject()} onClick={(e) => handleAddProject(e)}>Confirm</Button>
                                    <Button color='danger' onClick={() => setAddingProject(false)}>Cancel</Button>
                                </div> :
                                <div className='add-project'>
                                    <i className="fas fa-plus" onClick={() => setAddingProject(true)}></i>
                                    <span className='buttonless d-flex align-right ml-2' onClick={() => setViewCompletedProjects(!viewCompletedProjects)}>{viewCompletedProjects ? 'Hide' : 'Show'} Completed Projects</span>
                                </div>
                        }
                    </div>
                </Col>
            </Row>
        </div>
    );
}