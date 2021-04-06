import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { useToasts } from 'react-toast-notifications';
import { audience } from '../../auth_config.json';
import { addUserData, updateUserData, updateUser, asyncHandler } from '../../utils/index';
import moment from 'moment';
import duration from 'moment-duration-format';
duration(moment);

export const AppContext = React.createContext();

export default (props) => {

    const { isLoading, error, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const baseApiUrl = 'https://todoplus-backend.herokuapp.com/api';
    // const baseApiUrl = 'http://localhost:3001/api';
    const { addToast } = useToasts();
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const workTimeInterval = setInterval(() => {
            workTimeSetter();
        }, 1000);

        const dateTimeInterval = setInterval(() => {
            setDateTime(new Date())
        }, 1000);

        return () => {
            clearInterval(workTimeInterval);
            clearInterval(dateTimeInterval);
        };
    }, []);

    // Goal setting:
    const [workTimeAvailable, setWorkTimeAvailable] = useState(0);
    const [modalSetGoalsOpen, setModalSetGoalsOpen] = useState(false);
    const [goalTypeToday, setGoalTypeToday] = useState(true);
    const [enforceSetGoal, setEnforceSetGoal] = useState(false);
    const [currentProductivityRecord, setCurrentProductivityRecord] = useState({});
    const [modalSessionOpen, setModalSessionOpen] = useState(false);
    const [goalSuggestion, setGoalSuggestion] = useState('');
    const [weeklyGoalSet, setWeeklyGoalSet] = useState(false);

    const handleSetGoal = (goalTypeToday) => {
        setGoalTypeToday(goalTypeToday);
        setModalSetGoalsOpen(true);
    };

    const switchSetGoal = (seconds) => {
        if (goalTypeToday) {
            setProductivityGoal(seconds);
        } else {
            setWeeklyProductivityGoal(seconds);
        }
    };

    const setWeeklyProductivityGoal = asyncHandler(async(seconds) => {

        const token = await getAccessTokenSilently({ audience });
        const data = {
            _id: userData._id,
            weeklyProductivityGoal: seconds
        };

        const response = await axios.put(`${baseApiUrl}/user/setWeeklyProductivityGoal`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            updateUser(userData, setUserData, 'weeklyProductivityGoal', seconds);
            setEnforceSetGoal(false);
            setModalSetGoalsOpen(false);
            setWeeklyGoalSet(true);
        }  
    });

    const setProductivityGoal = asyncHandler(async(seconds) => {
        const data = {
            productivityRecordId: currentProductivityRecord._id,
            productivityGoal: seconds
        };

        const token = await getAccessTokenSilently({ audience });

        const response = await axios.put(`${baseApiUrl}/user/setProductivityGoal`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            setModalSetGoalsOpen(false);
            updateUserData(userData, setUserData, 'productivityRecords', currentProductivityRecord._id, response.data);
        }
    });

    const timeFormatter = (seconds) => {
        const duration = moment.duration(seconds, 'seconds');
        if (seconds >= 60) {
            return duration.format('hh:mm:ss');
        } else {
            return `00:${duration.format('hh:mm:ss')}`;
        }
    };

    const createProductivityEntry = asyncHandler(async() => {
        const token = await getAccessTokenSilently({ audience });
        const data = {
            productivityRecordId: currentProductivityRecord._id,
            task: selectedTask
        };

        const response = await axios.post(`${baseApiUrl}/productivityRecord/createProductivityEntry`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setCurrentProductivityRecord(response.data);
    });

    // Projects, tasks, subtasks, notes, details
    const [userData, setUserData] = useState({});
    const [selectedProject, setSelectedProject] = useState({});
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [reminderTasks, setReminderTasks] = useState([]);
    const [notifiedTasks, setNotifiedTasks] = useState([]);

    useEffect(() => {
        if (isAuthenticated && user) {
            getUserData();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (userData._id) {
            const { productivityRecords } = userData;
            const currentProductivityRecord = productivityRecords[productivityRecords.length - 1];
            console.log(currentProductivityRecord);
            setCurrentProductivityRecord(currentProductivityRecord);
            const suggestedWorkHours = timeFormatter(userData.weeklyProductivityGoal / 7);
            setGoalSuggestion(suggestedWorkHours);

            if (userData.weeklyProductivityGoal === 0) {
                handleSetGoal(false); // false = weekly
                setEnforceSetGoal(true);
            } else {
                setWeeklyGoalSet(true);
            } 
            
            if (userData.weeklyProductivityGoal > 0 && weeklyGoalSet) {
                if (!currentProductivityRecord.productivityGoal || currentProductivityRecord.productivityGoal === 0) {
                    handleSetGoal(true); // true = today's productivity record
                    setEnforceSetGoal(true);    
                }
            }
        }
        if (userData.projects && userData.projects.length > 0) {
            const { projects } = userData;
            setReminderTasks(resolveReminderTasks(projects));
            const syntheticProjects = createSyntheticProjects(projects);
            const { dueToday } = syntheticProjects;

            const dueTodayIndex = userData.projects.findIndex(p => p._id === dueToday._id);
            if (dueTodayIndex === -1) {
                userData.projects.unshift(dueToday);
            } else {
                userData.projects[dueTodayIndex] = dueToday;
            }

            // updateUser(userData, setUserData, 'projects', projectsCopy);
            if (selectedProject && selectedProject._id) {
                const selectProject = userData.projects.find(p => p._id === selectedProject._id);
                setSelectedProject(selectProject);
            }
        }
    }, [userData, weeklyGoalSet]);

    useEffect(() => {
        // check if Task.reminderDate === dateTime
        for (let i = 0; i < reminderTasks.length; i++) {
            const task = reminderTasks[i];
            console.log(`${moment(task.reminderDate).format('MM/DD/YYYY HH:mm')} === ${moment(dateTime).format('MM/DD/YYYY HH:mm')}`);
            if (moment(task.reminderDate).format('MM/DD/YYYY HH:mm') === moment(dateTime).format('MM/DD/YYYY HH:mm') && !notifiedTasks.includes(task._id)) {
                createReminderNotification(task);
                notifiedTasks.push(task._id);
            }
        }
    }, [dateTime]);

    useEffect(() => {
        console.log(`%%%%%%%%%%%%%% REMINDER TASKS %%%%%%%%%%%%%%`);
        console.log(reminderTasks);
    }, [reminderTasks]);

    const resolveReminderTasks = (projects) => {
        const tasks = [];
        console.log(projects);
        for (let i = 0; i < projects.length; i++) {
            const currentProject = projects[i];
            if (currentProject && currentProject.tasks) {
                for (let j = 0; j < currentProject.tasks.length; j++) {
                    const currentTask = currentProject.tasks[j];
                    if (currentTask && currentTask.reminderDate && !currentTask.completed && moment(currentTask.reminderDate).isValid()) {
                        //check if reminderDate is today
                        console.log(`valid 1: currentTask.reminderDate: ${currentTask.reminderDate}, ${moment(currentTask.reminderDate).format('MM/DD/YYYY')}`)
                        if (moment().format('MM/DD/YYYY') === moment(currentTask.reminderDate).format('MM/DD/YYYY')) {
                            console.log(`valid 2: currentTask.reminderDate: ${moment(currentTask.reminderDate).format('MM/DD/YYYY')}`)
                            currentTask.project = currentProject;
                            tasks.push(currentTask);
                        }
                    }
                }
            }
        }
        console.log(tasks);
        return tasks;
    }

    const createSyntheticProjects = (projects) => {
        const dueToday = {
            _id: 'dueToday',
            completed: false,
            name: 'Due Today',
            tasks: []
        };

        for (let i = 0; i < projects.length; i++) {
            const currentProject = projects[i];
            if (currentProject && currentProject.tasks) {
                if (currentProject._id !== dueToday._id) {
                    for (let j = 0; j < currentProject.tasks.length; j++) {
                        const currentTask = currentProject.tasks[j];
                        if (currentTask.dueDate && moment(currentTask.dueDate).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY')) {
                            dueToday.tasks.push(currentTask);
                        }
                    }
                }
            }
        }

        console.log(dueToday.tasks);

        const syntheticProjects = {
            dueToday
        };

        return syntheticProjects;
    }

    // Edit projects
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [modalUpdateType, setModalUpdateType] = useState('');
    const [modalUpdateValue, setModalUpdateValue] = useState('');

    const workTimeSetter = () => {
        const eod = moment().hour(24).minute(0).second(0);
        const timeToEnd = eod.subtract({ hours: moment().format('HH'), minutes: moment().format('mm'), seconds: moment().format('ss') });
        const workTimeAvailableFormatted =  moment(timeToEnd).format('HH:mm:ss');

        setWorkTimeAvailable(workTimeAvailableFormatted);
        // setTimeToEnd(timeToEnd);

        if(workTimeAvailableFormatted === '00:00:01') {
            window.location.href = 'https://todoplus.herokuapp.com/profile/todos';
        }
    };

    const getUserData = asyncHandler(async () => {
        const token = await getAccessTokenSilently({ audience });

        const response = await axios.post(`${baseApiUrl}/userData`, {
            name: user.name,
            email: user.email
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            console.log(response.data);
            setUserData(response.data);
        }
    });

    const addProject = asyncHandler(async (name) => {
        const token = await getAccessTokenSilently({ audience });

        const data = {
            userId: userData._id,
            name
        }

        const response = await axios.post(`${baseApiUrl}/addProject`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (response.status === 200) {
            const { data } = response;
            addUserData(userData, setUserData, 'projects', data);
            return true;
        } else {
            return false;
        }
    });

    const addTask = asyncHandler(async (projectId, name) => {
        const token = await getAccessTokenSilently({ audience });

        const data = {
            projectId,
            name
        }

        const response = await axios.post(`${baseApiUrl}/project/addTask`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const { data } = response;
            updateUserData(userData, setUserData, 'projects', projectId, data);
            setSelectedProject(data);
            return true;
        } else {
            return false;
        }
    });

    // const completeTask = asyncHandler(async (taskId) => {
    //     const token = await getAccessTokenSilently({ audience });
    //     const data = {
    //         userId: userData._id,    
    //         projectId: selectedProject._id,
    //         taskId
    //     }

    //     const response = await axios.put(`${baseApiUrl}/project/task/complete`, {
    //         data
    //     }, {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     });

    //     if (response.status === 200) {
    //         setUserData(response.data);
    //         return true;
    //     } else {
    //         return false;
    //     }
    // });

    const markComplete = asyncHandler(async (type, completed, projectId, taskId=null, subtaskId=null) => {
        const token = await getAccessTokenSilently({ audience });

        const data = {
            projectId,
            completed
        }

        let endpoint;

        if (type === 'project') {
            endpoint = '/project';
        } else if (type === 'task') {
            data.taskId = taskId;
            endpoint = '/project/task';
        } else if (type === 'subtask') {
            data.taskId = taskId;
            data.subtaskId = subtaskId;
            endpoint = '/project/task/subtask';
        }

        endpoint += `/complete`;

        const response = await axios.put(`${baseApiUrl}/${endpoint}`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const { data } = response;
            updateUserData(userData, setUserData, 'projects', projectId, data);

            setSelectedProject(data);

            if (type === 'task' || type === 'subtask') {
                const updatedTask = data.tasks.find(t => t._id === taskId);
                setSelectedTask(updatedTask);
            }
        }
    });

    const addSubtask = asyncHandler(async (projectId, taskId, name) => {
        const token = await getAccessTokenSilently({ audience });

        const data = {
            projectId,
            taskId,
            name
        }

        const response = await axios.post(`${baseApiUrl}/project/task/addSubtask`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const { data } = response;
            updateUserData(userData, setUserData, 'projects', projectId, data);
            setSelectedProject(data);
            const updatedTask = data.tasks.find(t => t._id === taskId);
            setSelectedTask(updatedTask);
            return true;
        }
    });

    const handleUpdate = (type, value, note=null) => {
        setModalUpdateType(type);
        setModalUpdateValue(value);
        setModalUpdateOpen(true);
        if (note) {
            setSelectedNote(note);
        }
    };

    const handleUpdateSubtask = (type, value, subtask) => {
        setModalUpdateType(type);
        setModalUpdateValue(value);
        setSelectedSubtask(subtask);
        setModalUpdateOpen(true);
    };

    const updateItem = asyncHandler(async (e, action='update') => {

        /* 
            action can equal 'update', 'delete',
        */

        e.preventDefault();
        const type = modalUpdateType.toLowerCase();
        const data = {
            name: modalUpdateValue,
            projectId: selectedProject._id
        }

        let endpoint;

        if (type === 'project') {
            endpoint = 'project';
        } else if (type === 'task') {
            endpoint = 'project/task';
            data.taskId = selectedTask._id
        } else if (type === 'subtask') {
            endpoint = 'project/task/subtask';
            data.taskId = selectedTask._id;
            data.subtaskId = selectedSubtask._id;
        } else {
            endpoint = 'project/task/note';
            data.taskId = selectedTask._id;
            data.noteId = selectedNote._id;
        }

        endpoint += `/${action}`;

        const token = await getAccessTokenSilently({ audience });
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const response = await axios.put(`${baseApiUrl}/${endpoint}`, { data }, config);

        if (response.status === 200) {
            const { data } = response;

            setModalUpdateOpen(false);

            let updateProject = true;
            let updatedTask = null;
            if (selectedTask) {
                updatedTask = data.tasks && data.tasks.find(t => t._id === selectedTask._id);
            }

            if (action === 'delete') {
                if (type === 'project') {
                    const newProjects = userData.projects.filter(p => p._id !== selectedProject._id);
                    updateUser(userData, setUserData, 'projects', newProjects);

                    setSelectedProject(null);
                    setSelectedTask(null);
                    updateProject = false;
                } else if (type === 'task') {
                    setSelectedProject(data);
                    setSelectedTask(null);
                } else {
                    setSelectedProject(data);
                    setSelectedTask(updatedTask);
                }
            } else {
                setSelectedProject(data);
                setSelectedTask(updatedTask);
            }

            if (updateProject) {
                updateUserData(userData, setUserData, 'projects', selectedProject._id, data);
            }
        }
    });

    // const setTaskDueAndReminderDate = asyncHandler(async (date, reminder) => {

    //     let endpoint;
    //     const data = {
    //         projectId: selectedProject._id,
    //         taskId: selectedTask._id,
    //     };

    //     if (reminder) {
    //         data.reminderDate = date;
    //         endpoint = 'project/task/setReminderDate';
    //     } else {
    //         data.dueDate = date;
    //         endpoint = 'project/task/setDueDate';
    //     }

    //     const token = await getAccessTokenSilently({ audience });

    //     const response = await axios.put(`${baseApiUrl}/${endpoint}`, {
    //         data
    //     }, {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     });

    //     if (response.status === 200) {
    //         const { data } = response;
    //         console.log(data);
    //         updateUserData(userData, setUserData, 'projects', selectedProject._id, data);
    //         setSelectedProject(data);
    //         const updatedTask = data.tasks.find(t => t._id === selectedTask._id);
    //         setSelectedTask(updatedTask);
    //     }
    // });

    const setTaskDueAndReminderDate = asyncHandler(async (date, projectId, taskId, reminder) => {

        let endpoint;
        const data = {
            projectId,
            taskId
        };

        if (reminder) {
            data.reminderDate = date;
            endpoint = 'project/task/setReminderDate';
        } else {
            data.dueDate = date;
            endpoint = 'project/task/setDueDate';
        }

        const token = await getAccessTokenSilently({ audience });

        const response = await axios.put(`${baseApiUrl}/${endpoint}`, {
            data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const { data } = response;
            updateUserData(userData, setUserData, 'projects', projectId, data);

            if (selectedProject && selectedProject._id === projectId) {
                setSelectedProject(data);
            }

            if (selectedTask && selectedTask._id === taskId) {
                const updatedTask = data.tasks.find(t => t._id === taskId);
                setSelectedTask(updatedTask);
            }
        }
    });

    const createTaskNote = asyncHandler(async (name) => {

        const token = await getAccessTokenSilently({ audience });
        const res = await axios.post(`${baseApiUrl}/project/task/createTaskNote`, {
            data: {
                projectId: selectedProject._id,
                taskId: selectedTask._id,
                name
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const { data } = res;

        if (res.status === 200) {
            updateUserData(userData, setUserData, 'projects', selectedProject._id, data);
            setSelectedProject(data);

            const updatedTask = data.tasks.find(t => t._id === selectedTask._id);
            setSelectedTask(updatedTask);

            return true;
        }
        
    });

    const saveAttachments = asyncHandler(async(attachments) => {
        const token = await getAccessTokenSilently({ audience });
        const res = await axios.post(`${baseApiUrl}/project/task/saveAttachments`, {
            data: {
                projectId: selectedProject._id,
                taskId: selectedTask._id,
                attachments
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const { data } = res;
        const updatedTask = data.tasks.find(t => t._id === selectedTask._id);

        updateUserData(userData, setUserData, 'projects', selectedProject._id, data);
        setSelectedProject(data);
        setSelectedTask(updatedTask);
        console.log(data);
        return true;
    });


    // Create Notification:
    // const createReminderNotification = (type, message) => {
    //     return () => {
    //         switch (type) {
    //             case 'info':
    //                 NotificationManager.info(message);
    //                 break;
    //             case 'success':
    //                 NotificationManager.success(message);
    //                 break;
    //             case 'warning':
    //                 NotificationManager.warning(message);
    //                 break;
    //             case 'error':
    //                 NotificationManager.error(message);
    //                 break;
    //         }
    //     };
    // };

    const createReminderNotification = (task) => {
        addToast(task.name, { appearance: 'info', project: task.project, task, setSelectedProject, setSelectedTask, setTaskDueAndReminderDate });
    };

    // const createReminderNotification = () => {
    //     addToast('Lorem Ipsum is simply dummy text of the printing and typesetting industry', { appearance: 'info' });
    // }

    return (
        <AppContext.Provider value={{
            goals: {
                workTimeAvailable,
                modalSetGoalsOpen,
                setModalSetGoalsOpen,
                goalTypeToday,
                handleSetGoal,
                enforceSetGoal,
                setWeeklyProductivityGoal,
                setProductivityGoal,
                switchSetGoal,
                currentProductivityRecord,
                timeFormatter,
                modalSessionOpen, 
                setModalSessionOpen,
                createProductivityEntry,
                goalSuggestion
            },
            projects: {
                projectsList: userData.projects,
                selectedProject,
                setSelectedProject,
                addProject
            },
            tasks: {
                taskList: selectedProject && selectedProject.tasks,
                selectedTask,
                setSelectedTask,
                addTask,
                setTaskDueAndReminderDate,
                createTaskNote,
                saveAttachments
            },
            subtasks: {
                addSubtask
            },
            userData,
            actions: {
                handleUpdate,
                handleUpdateSubtask,
                createReminderNotification,
                markComplete
            },
            modalUpdate: {
                modalUpdateOpen, 
                setModalUpdateOpen,
                modalUpdateType,
                modalUpdateValue, 
                setModalUpdateValue,    
                updateItem
            }
        }}>
            { props.children }
        </AppContext.Provider>
    );
}