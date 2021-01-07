import React, { useState, useEffect, useContext } from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { AppContext } from '../components/Context/index';
import { Row, Col, TabContent, TabPane, Nav, NavItem, Button } from 'reactstrap';
import moment from 'moment';
import classnames from 'classnames';

// Components:
import StatsGraphs from '../components/stats/StatsGraph';
import DetailedStats from '../components/stats/DetailedStats';

const Stats = () => {

    const { userData, goals } = useContext(AppContext);
    const { productivityRecords } = userData;
    const { timeFormatter, goalSuggestion } = goals;
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    // return
    return(
        <div>
            <Row>
                <Col md={12}>
                    <Button onClick={() => toggle('1')} active={activeTab === '1'} className='d-inline mr-1'>Weekly Stats</Button>
                    <Button onClick={() => toggle('2')} active={activeTab === '2'} className='d-inline mr-1'>Detailed Stats</Button>
                </Col>
            </Row>
            <Row>
                {
                    activeTab === '1' ?
                        <StatsGraphs 
                            productivityRecords={productivityRecords}
                            timeFormatter={timeFormatter}
                        /> 
                        :
                    activeTab === '2' ?
                        <DetailedStats 
                            userData={userData}
                            goalSuggestion={goalSuggestion}
                            timeFormatter={timeFormatter}
                        /> :
                    null
                }
            </Row>
        </div>
    );
}

export default withAuthenticationRequired(Stats);