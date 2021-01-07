import React from 'react';
import { XYPlot, ArcSeries } from "react-vis";

export default ({
    productivityGoal,
    productivityAchieved
}) => {

    return (
        <div className='status-bar-graph-wrapper1 mb-3'>
            <XYPlot
                xDomain={[-3, 3]}
                yDomain={[-3, 3]}
                width={150}
                getAngle={d => d.total} //this refers to the total data
                getAngle0={d => 0}
                height={150}
                className='statusbar-graph'
                >
                <ArcSeries
                    animation={{
                        damping: 9,
                        stiffness: 300
                    }}
                    style={{
                        strokeWidth: 2
                    }}
                    radiusDomain={[0, 3]}
                    data={[
                    { total: productivityGoal, radius0: 3, radius: 2.5, color: "white" },
                    {
                        total: (productivityAchieved / productivityGoal) * 6.3,
                        radius0: 3,
                        radius: 2.5,
                        color: "#f2b632"
                    }
                    ]}
                    colorType={"literal"}
                />
            </XYPlot>
        </div>
    );
}