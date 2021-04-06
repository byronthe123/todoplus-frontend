import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import fileDownload from 'js-file-download';
import FileBase64 from 'react-file-base64';

export default ({
    attachments,
    saveAttachments
}) => {

    const [resolvedAttachments, setResolvedAttachments] = useState([]);
    const [attachmentsKey, setAttachmentsKey] = useState(0);

    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        if (contentType === 'text/plain') {
            const blob = URL.createObjectURL(new Blob([b64Data] , {type:'text/plain'}));
            return blob;
        } else {
            const byteCharacters = atob(b64Data);
            const byteArrays = [];
          
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);
            
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
            
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
          
            const blob = new Blob(byteArrays, {type: contentType});
            return blob;
        }
    }
    
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return binary;
    }

    const resolveAttachments = (attachments) => {
        const array = [];
        if (attachments) {
            for (let i = 0; i < attachments.length; i++) {

                const { data, contentType, name} = attachments[i];
    
                if (data) {
                    const base64 = arrayBufferToBase64(data.data);
                    const blob = b64toBlob(contentType === 'text/plain' ? data.data : base64, contentType);
        
                    array.push({
                        name,
                        contentType,
                        blob
                    });
                }
    
            }
        }

        return array;
    }

    useEffect(() => {
        const resolvedAttachments = resolveAttachments(attachments);
        setResolvedAttachments(resolvedAttachments);
    }, [attachments]);

    const handleSaveAttachments = async (attachments) => {
        await saveAttachments(attachments);
        setAttachmentsKey(attachmentsKey+1);
    };

    return (
        <Row>
            <Col md={12}>
                <h5>Attachments</h5>
                <ul>
                    {
                        resolvedAttachments.map((a, i) => 
                            a.contentType === 'text/plain' ?
                                <a href={a.blob} id="link" download={a.name}>{a.name}</a> :
                                <li className='attachment' key={i} onClick={() => fileDownload(a.blob, a.name)}>{a.name}</li>
                        )
                    }
                </ul>
                <FileBase64 
                    multiple={true}
                    onDone={handleSaveAttachments}
                    key={attachmentsKey}
                />
            </Col>
        </Row>
    );
}