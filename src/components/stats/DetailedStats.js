import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import PercentageStat from './PercentageStat';

export default ({
    userData,
    goalSuggestion,
    timeFormatter
}) => {

    const [totalProductivityScore, setTotalProductivityScore] = useState('');
    const [weekProductivityScore, setWeekProductivityScore] = useState('');
    const [totalAverageProductiveHours, setTotalAverageProductiveHours] = useState('');
    const [weekAverageProductiveHours, setWeekAverageProductiveHours] = useState('');
    const [highestProductiveHours, setHighestProductiveHours] = useState('');
    const [highestProductiveHoursDescription, setHighestProductiveHoursDescription] = useState('');
    const [highestProductiveScore, setHighestProductiveScore] = useState('');
    const [highestProductiveScoreDescription, setHighestProductiveScoreDescription] = useState('');

    const resolveProductiveAverageHours = (hours, days) => {
        return ((hours / days) / 3600).toFixed(2);
    }

    const resolveHighestProductiveHours = () => {
        const sortedProductivityRecords = userData.productivityRecords.sort((a, b) => b.productivityAchieved - a.productivityAchieved);
        const day = sortedProductivityRecords[0];
        const hours = (day.productivityAchieved / 3600).toFixed(2);
        const score = ((day.productivityAchieved / day.productivityGoal) * 100).toFixed(0);
        setHighestProductiveHoursDescription(`${moment(day.createdAt).format('MM/DD/YYYY')}, Productivity Score: ${score}%`);
        setHighestProductiveHours(hours);
    }

    const resolveHighestProductiveScore = () => {
        const sortedProductivityRecords = userData.productivityRecords.sort((a, b) => {
            return (b.productivityAchieved / b.productivityGoal) - (a.productivityAchieved / a.productivityGoal)
        });
        const day = sortedProductivityRecords[0];
        setHighestProductiveScore(((day.productivityAchieved / day.productivityGoal) * 100).toFixed(0));
        setHighestProductiveScoreDescription(`${moment(day.createdAt).format('MM/DD/YYYY')}, Productive Time: ${timeFormatter(day.productivityAchieved / 3600)}, Goal: ${timeFormatter(day.productivityGoal / 3600)}`);
    }

    const resolveCumulativeProductivityScore = () => {
        const { productivityRecords } = userData;
        const weekDates = [];

        let totalGoal = 0;
        let totalAchieved = 0;
        let weekGoal = 0;
        let weekAchieved = 0;

        for (let i = 7 - 1; i > -1; i--) {
            weekDates.push(moment().subtract(i, 'days').format('L'));
        }

        for (let i = 0; i < productivityRecords.length; i++) {
            const current = productivityRecords[i];
            const date = moment(current.createdAt).format('L');

            totalGoal += current.productivityGoal;
            totalAchieved += current.productivityAchieved;

            if (weekDates.includes(date)) {
                const index = weekDates.indexOf(date);
                weekDates.splice(index, 1);
                weekGoal += current.productivityGoal;
                weekAchieved += current.productivityAchieved;
            }
        }

        const cumulativeScore = parseInt((totalAchieved / totalGoal) * 100).toFixed(0);
        const weekScore = parseInt((weekAchieved / weekGoal) * 100).toFixed(0);
        setTotalProductivityScore(cumulativeScore);
        setWeekProductivityScore(weekScore);
        setTotalAverageProductiveHours(resolveProductiveAverageHours(totalAchieved, productivityRecords.length));
        setWeekAverageProductiveHours(resolveProductiveAverageHours(weekAchieved, 7));
    }

    useEffect(() => {
        resolveCumulativeProductivityScore();
        resolveHighestProductiveHours();
        resolveHighestProductiveScore();
    }, [userData]);

    return (
        <Row className='full-width mx-2 mt-4' style={{ height: '100vh' }}>
            <Col md={6}>
                <PercentageStat 
                    value={totalProductivityScore}
                    name={'Total Productivity Score:'}
                    description={'all productivity achieved / all goals set.'}
                    percentage={true}
                />
                <PercentageStat
                    value={weekProductivityScore}
                    name={`Current Week's Productivity Score:`}
                    description={'productivity achieved / goals set for the last 7 days.'}
                    percentage={true}
                />
                <PercentageStat 
                    value={totalAverageProductiveHours}
                    name={'Total Average Daily Productive Hours'}
                    description={''}
                    percentage={false}
                />
            </Col>
            <Col md={6}>
                <PercentageStat 
                    value={weekAverageProductiveHours}
                    name={`Current Week's Average Daily Productive Hours:`} 
                    description={`suggestion to meet weekly goal: ${goalSuggestion}.`}
                    percentage={false}
                />
                <PercentageStat 
                    value={highestProductiveHours}
                    name={`Highest Productive Hours in a single day:`} 
                    description={highestProductiveHoursDescription}
                    percentage={false}
                />
                <PercentageStat 
                    value={highestProductiveScore}
                    name={`Highest Productivity Score in a single day`}
                    description={highestProductiveScoreDescription}
                    percentage={true}
                />
            </Col>
        </Row>
    );
}
