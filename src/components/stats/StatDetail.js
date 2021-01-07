import React from 'react';

export default ({
    entry, 
    timeFormatter
}) => {
    return (
        <div className='row-main full-width'>
            <h5>Task: {entry.taskName}</h5>
            <h5>Productive Time: {timeFormatter(entry.productiveTime)}</h5>
        </div>
    );
}   