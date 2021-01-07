import { NotificationManager } from 'react-notifications';

export const asyncHandler = (cb) => {
    return async (...args) => {
        try {
            return await cb(...args);
        } catch(error){            
            console.log(error);
            let status, name, message;
            if (error.response && error.response.data) {
                status = error.response.status;
                name = error.response.data.name && error.response.data.name;
                message = error.response.data.message && error.response.data.message;
            }

            const errorMessage = `Sorry - something went wrong!\n${status}: ${name}. ${message}`;
            NotificationManager.error(`${errorMessage}`, null, 10000);
        }
    }
};

export const addUserData = (userData, setUserData, property, value) => {
    const copy = Object.assign({}, userData);
    copy[property].push(value);
    setUserData(copy);
};

export const updateUserData = (userData, setUserData, property, _id, value) => {
    const copy = Object.assign({}, userData);
    const updatePropIndex = copy[property].findIndex(p => p._id === _id);
    copy[property][updatePropIndex] = value;
    setUserData(copy);
};

export const addProjectTask = (userdata, setUserData, projectId, task) => {
    const copy = Object.assign({}, userdata);
    const updateProjectIndex = copy.projects.findIndex(p => p._id === projectId);
    copy.projects[updateProjectIndex].tasks.push(task);
    setUserData(copy);
};

export const updateUser = (userData, setUserData, property, value) => {
    const copy = Object.assign({}, userData);
    copy[property] = value;
    setUserData(copy);
};
