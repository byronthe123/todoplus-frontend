import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../components/Context/index';
import { Route, NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { Row, Col, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import moment from 'moment';

import NavBar from './NavBar';
import StatusBarGraph from './StatusBarGraph';

export default () => {

    const { userData, goals } = useContext(AppContext);
    const { weeklyProductivityGoal } = userData;
    const { workTimeAvailable, handleSetGoal, currentProductivityRecord, timeFormatter } = goals;
    const { productivityGoal, productivityAchieved } = currentProductivityRecord;
    const [percentage, setPercentage] = useState('0%');
    const [leftPosition, setLeftPosition] = useState('sp-left-1');

    useEffect(() => {
        const percentage = Math.round(productivityAchieved / productivityGoal * 100);
        !isNaN(percentage) && setPercentage(`${percentage}%`);
        if (percentage.length > 2) {
            setLeftPosition('sp-left-2');
        } else if (percentage.length > 3) {
            setLeftPosition('sp-left-3');
        }
    }, [productivityGoal, productivityAchieved]);

    return (
        <Row className="status-bar">
            <Col md={4} className="justify-content-end">
                <StatusBarGraph 
                    productivityGoal={productivityGoal}
                    productivityAchieved={productivityAchieved}
                />
                <Row>
                    <Col md={4}>
                        <div className="dropdown">
                            <h3 className={classnames('status-percent', leftPosition)} id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                { percentage }
                            </h3>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <button className="dropdown-item" type="button">Current Productive Time: {timeFormatter(productivityAchieved)}</button>
                                <button className="dropdown-item" type="button" onClick={() => handleSetGoal(true)}>Productivity Goal: {timeFormatter(productivityGoal)}<i className="fas fa-edit ml-1"></i></button>
                                <button className="dropdown-item" type="button" onClick={() => handleSetGoal(false)}>Weekly Goal: {timeFormatter(weeklyProductivityGoal)}<i className="fas fa-edit ml-1"></i></button>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <h3 className='out-time'>{workTimeAvailable}</h3>
                    </Col>
                </Row>
            </Col>
            <Col lg={4} className='text-center align-middle'>
                <NavLink to='/todos'><h1 className='title'>To Do Plus</h1></NavLink>
            </Col>
            <Col lg={4}>
                <NavBar/>
            </Col>
        </Row>
    );
}