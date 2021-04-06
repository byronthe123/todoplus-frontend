import React from 'react';
import { Row, Col } from 'reactstrap';
import { XYPlot, ArcSeries } from "react-vis";
import {
    useWindowSize,
    useWindowWidth,
    useWindowHeight,
} from '@react-hook/window-size'

export default ({
    percentage,
    value,
    name,
    description
}) => {

    const [width, height] = useWindowSize();

    const resolveLeftPercentage = () => {
        if (percentage && value > 99) {
            return '80px';
        } else if (percentage && value < 99) {
            return '90px';
        } else if (!percentage) {
            return '82px'
        }
    }

    return (
        <Row>
            <Col md={width > 1600 ? 2 : 3}>
                <XYPlot
                    xDomain={[-3, 3]}
                    yDomain={[-3, 3]}
                    width={150}
                    getAngle={d => d.total} //this refers to the total data
                    getAngle0={d => 0}
                    height={150}
                    style={{ position: 'relative' }}
                    >
                    <ArcSeries
                        animation={{
                            damping: 9,
                            stiffness: 300
                        }}
                        style={{
                            strokeWidth: 0.2,
                            stroke: 'black'
                        }}
                        radiusDomain={[0, 3]}
                        data={[
                        { total: 100, radius0: 3.5, radius: 2.5, color: "white" },
                        {
                            total: percentage ? (value / 100) * 6.3 : 100 * 6.3,
                            radius0: 3.5,
                            radius: 2.5,
                            color: percentage ? "#f2b632" : 'white'
                        }
                        ]}
                        colorType={"literal"}
                    />
                </XYPlot>
                <h5 style={{ position: 'absolute', top: '50px', left: resolveLeftPercentage() }}>
                    { value }{percentage && '%'}
                </h5>
            </Col>
            <Col md={6}>
                <h5 className='stats-subtitle mt-4'>
                    {name} 
                    <br />
                    {description}
                </h5>
            </Col>
        </Row>
    );
}
