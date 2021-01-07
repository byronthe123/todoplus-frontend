import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './Context/index';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form } from 'reactstrap';

export default () => {

    const { modalUpdate } = useContext(AppContext);
    const {
        modalUpdateOpen, 
        setModalUpdateOpen,
        modalUpdateType,
        modalUpdateValue, 
        setModalUpdateValue,    
        updateItem,
        deleteItem
    } = modalUpdate;

    const [copyObj, setCopyObj] = useState({});

    useEffect(() => {
        const obj = {
            initialValue: modalUpdateValue
        };

        const copy = Object.assign({}, obj);
        setCopyObj(copy);
    }, [modalUpdateOpen]);


    const toggle = () => setModalUpdateOpen(!modalUpdateOpen);

    const enableSubmit = () => modalUpdateValue.length > 0 && modalUpdateValue !== copyObj.initialValue;

    return (
        <Modal isOpen={modalUpdateOpen} toggle={toggle}>
            <ModalHeader>Update {modalUpdateType}</ModalHeader>
            <ModalBody>
                <Form onSubmit={(e) => updateItem(e, 'update')}>
                    <Input type='text' value={modalUpdateValue} onChange={(e) => setModalUpdateValue(e.target.value)} />
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button className={`${enableSubmit() && 'btn-submit'}`} disabled={!enableSubmit()} onClick={(e) => updateItem(e, 'update')}>Submit</Button>
                <Button color='danger' onClick={(e) => updateItem(e, 'delete')}>Delete</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
  );
}
