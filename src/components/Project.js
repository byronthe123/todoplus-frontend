import React, { useState } from 'react';
import classnames from 'classnames';

export default ({
    project,
    selectedProject,
    setSelectedProject,
    handleUpdate,
    markComplete
}) => {

    const [isHovered, setIsHovered] = useState(false);

    const isSelectedProject = () => {
        if (selectedProject && project) {
            const check = project._id === selectedProject._id;
            return check;
        } 
        return false;
    };

    return (
        <>
            <h5 
                className={` project ${isSelectedProject() && 'selected-project'}`}
                onClick={() => setSelectedProject(project)}
            >
                <i 
                    className={classnames('check-complete-task mr-2 far', 
                        { 'fa-check-circle':  !project.completed && isHovered},
                        { 'fa-circle':  !project.completed && !isHovered},
                        { 'fa-check-circle': project.completed && !isHovered },
                        { 'fa-circle': project.completed && isHovered }
                    )} 
                    style={{ fontSize: '16px' }} 
                    onMouseOver={() => setIsHovered(true)}
                    onMouseOut={() => setIsHovered(false)}
                    onClick={() => markComplete('project', !project.completed, project._id)}
                />
                { project.name }
                {
                    isSelectedProject() && 
                    <i className='fas fa-edit float-right pr-2' onClick={() => handleUpdate('Project', project.name)} />
                }
            </h5>
        </>
    );
}