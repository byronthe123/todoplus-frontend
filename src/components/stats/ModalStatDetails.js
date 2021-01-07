import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import StatDetail from './StatDetail';

export default ({
    modal,
    setModal,
    record,
    timeFormatter
}) => {

    const productivityData = record && record.productivityData ? record.productivityData : null;
    const toggle = () => setModal(!modal);
    const [groupedEntries, setGroupedEntries] = useState([]);

    useEffect(() => {
        if (productivityData && productivityData.entries) {
            const { entries } = productivityData;
            const grouped = [];

            for (let i = 0; i < entries.length; i++) {
                const currentEntry = entries[i];
                if (currentEntry && currentEntry.task) {
                    const existingIndex = grouped.findIndex(entry => entry.task._id === currentEntry.task._id);
                    if (existingIndex !== -1) {
                        grouped[existingIndex].productiveTime += currentEntry.productiveTime;
                    } else {
                        grouped.push(currentEntry);
                    }
                }
            }

            setGroupedEntries(grouped);
        }
    }, [record]);

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader>Stats for {moment(record && record.date).format('dddd LL')}</ModalHeader>
                <ModalBody>
                {
                    productivityData && 
                    <>
                        <h6>Productivity Goal: {timeFormatter(record.productivityData.productivityGoal)}</h6>
                        <h6>Productivity Achieved: {timeFormatter(record.productivityData.productivityAchieved)}</h6>
                        <h6>Tasks:</h6>
                        {
                            groupedEntries.map(
                                entry => <h6>{entry.task.name}: {timeFormatter(entry.productiveTime)}</h6>
                            )
                        }
                    </>
                }
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}