import React, { useState, useEffect } from 'react';
import {
  FlexibleWidthXYPlot, 
  FlexibleXYPlot,
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  LabelSeries,
  Hint
} from 'react-vis';
import moment from 'moment';
import {Row, Col} from 'reactstrap';
import classnames from 'classnames';

// Components
// import StatsDetailsContainer from './StatsDetailsContainer';
import ModalStatDetails from './ModalStatDetails';

export default ({
    productivityRecords,
    timeFormatter
}) => {

    const [value, setValue] = useState(null);
    const [stats, setStats] = useState([]);
    const [greenData, setGreenData] = useState([]);
    const [blueData, setBlueData] = useState([]);
    const [labelData, setLabelData] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [detailsRecord, setDetailsRecord] = useState(null);
    

    const getStats = (range=7) => {
        console.log(`called getStats`);
        const weekDates = [];
        const stats = [];

        // for(let i = 0; i < range; i++) {
        //     weekDates.push(moment().subtract(i, 'days').format('L'));
        // }

        for (let i = range - 1; i > -1; i--) {
            weekDates.push(moment().subtract(i, 'days').format('L'));
        }

        console.log(weekDates);
        console.log(productivityRecords);

        for(let i = 0; i < weekDates.length; i++) {
            // console.log(weekDates[i]);
            const stat = {
                date: weekDates[i]
            };
        
            for(let j = (productivityRecords.length - 1); j > (productivityRecords.length - range); j--) {
                if(productivityRecords[j]) {
                    if(moment(productivityRecords[j].createdAt).format('L') === weekDates[i]) {
                        stat.productivityData = productivityRecords[j];
                    }
                }
            }

            stats.push(stat);
        }

        console.log(stats);

        setStats(stats);
        const greenData = stats.map(function (stat) {
            const entry = {
                x: stat.date, 
                y: stat.productivityData ? stat.productivityData.productivityAchieved / 3600 : null, 
                num: stat.productivityData ?  stat.productivityData.productivityAchieved: 0
            }
            return entry;
        });
        console.log(greenData);
        setGreenData(greenData);

        const blueData = stats.map(function (stat) {
            const entry = {
                x: stat.date, 
                y: stat.productivityData ? stat.productivityData.productivityGoal/3600 : null, 
                num: stat.productivityData ? stat.productivityData.productivityGoal: 0
            }
            return entry;
        });
        console.log(blueData);
        setBlueData(blueData);

        const labelData = greenData.map((d, idx) => ({
            x: d.x,
            y: greenData[idx].y,
            z: (greenData[idx].y !== null || blueData[idx].y !== null) ? 
                Math.round((greenData[idx].y / blueData[idx].y) * 100) + '%' : 
                'No Data',
            a: timeFormatter(greenData[idx].num),
            b: timeFormatter(blueData[idx].num)
        }));
        setLabelData(labelData);
    }

    useEffect(() => {
        productivityRecords && getStats();
    }, [productivityRecords]);

    const rememberValue = (captureValue) => {
        // console.log(captureValue);
        // console.log(labelData);
        // console.log(stats);
        const match = labelData.filter((data) => data.x === captureValue.x);
        const value = {
            Achieved: match[0].a,
            Goal: match[0].b,
            x: captureValue.x,
            y: captureValue.y,
        };
        setValue(value);
    };

    const handleShowDetails = () => {
        const selectedDate = value && value.x;
        const matchedRecord = stats.filter(stat => stat.date === selectedDate)[0];
        console.log(matchedRecord);
        const entry = matchedRecord.productivityData.entries[0]; //entry.productivityTime, entry.taskName
        setShowDetails(true);
        setDetailsRecord(matchedRecord);
    }

    const BarSeries = VerticalBarSeries;
    return (
        <Row className='row-main full-width mx-2'>
            <Col md={12}>
                <Row>
                    <Col md={12}>
                        <h6 className='stats-subtitle ml-2 mt-2'>
                            Stats for {`${moment().subtract(6, 'days').format('dddd LL')} - ${moment().format('dddd LL')}`}
                        </h6>
                    </Col>
                </Row>
                <Row style={{ height: '80vh' }}>
                    <Col md={12}>
                        <FlexibleXYPlot xType="ordinal" xDistance={100}>
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis />
                            <YAxis />
                            <BarSeries className="vertical-bar-series-example" onValueClick={() => handleShowDetails()} data={greenData} onValueMouseOver={rememberValue} onValueMouseOut={() => setValue(null)} color={'#f2b632'}/>
                            <BarSeries data={blueData} color={'#b5b5b7'}/>
                            <LabelSeries data={labelData} getLabel={d => d.z} />
                            {
                                value ? 
                                    <Hint value={value}>
                                        <div className='hint'>
                                            <h5>Achieved: {value.Achieved}</h5>
                                            <h5>Goal: {value.Goal}</h5>
                                        </div>
                                    </Hint> :
                                    null
                            }
                        </FlexibleXYPlot >
                    </Col> 
                </Row>
            </Col>

            <ModalStatDetails 
                modal={showDetails}
                setModal={setShowDetails}
                record={detailsRecord}
                timeFormatter={timeFormatter}
            />
        </Row>
    );
}
