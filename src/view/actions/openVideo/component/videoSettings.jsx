import React from 'react';
import { connect } from 'react-redux'
import { Field, formValueSelector, } from 'redux-form';
import * as validators from '../../../utils/validators';

import {Item, renderSelect, renderRadio, renderTextField} from '../../../utils/uiComponents';
import {Row, Col, Form, FormGroup, ControlLabel, Panel} from '../../../utils/uiComponents';

const VideoSettings = ({ ...props }) => (
    <Panel>
        <Panel.Heading>
            <Panel.Title componentClass="h3">Video Settings</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
        <Form horizontal className='u-gapTop2x'>
            <FormGroup>
                <Col componentClass={ControlLabel} xs={2}> Video Id </Col>
                <Col xs={4}>
                    <Field name='videoId' placeholder="Video Id" component={renderTextField} supportDataElement/>
                </Col>
            </FormGroup>
            <FormGroup>
                <Col componentClass={ControlLabel} xs={2}> Video Url </Col>
                <Col xs={4}>
                    <Field name='videoUrl' placeholder="Video URL" component={renderTextField} supportDataElement/>
                </Col>
            </FormGroup>
            <FormGroup>
                <Col componentClass={ControlLabel} xs={2}> Optional Video Metadata </Col>
                <Col xs={4}>
                    <Field name='videoMetadata' placeholder="Video Metadata" component={renderTextField} supportDataElement/>
                </Col>
            </FormGroup>
        </Form>
        </Panel.Body>
    </Panel>
)

export default connect()(VideoSettings);

export const formConfig = {
    settingsToFormValues(values, settings, meta) {
        const {
            video = {}
        } = settings;

        return {
            ...values,            
            videoId       : video.id,
            videoUrl      : video.url,
            videoMetadata : video.metadata
        }
        return values;
    },
    formValuesToSettings(settings, values) {
        const video = {
            id  : values.videoId,
            url : values.videoUrl,
        };

        {
            let metadata;
            if(validators.isJSON(values.videoMetadata)) {
                metadata = JSON.parse(values.videoMetadata);
            } else if(validators.isSingleDataElementToken(values.videoMetadata)){
                metadata = values.videoMetadata;
            }
            if(metadata) {
                video.metadata = metadata;
            }
        }

        return {
            ...settings, 
            video
        }
    },
    validate(errors, values) {
        errors = {
            ...errors
        };
      
        if (values.videoMetadata && 
            !validators.isJSON(values.videoMetadata) && 
            !validators.isSingleDataElementToken(values.videoMetadata)) {
            errors.videoMetadata = 'Please provide a K/V pairs as valid JSON String or a DataElement';
        }

        if (!values.videoId) {
            errors.videoId = 'Please provide a valid Video ID.';
        }

        if (!values.videoUrl) {
            errors.videoUrl = 'Please provide a valid Video URL.';
        }
      
        return errors;
    }
};