import React from 'react';
import { connect } from 'react-redux'
import { Field, formValueSelector, } from 'redux-form';


import {renderCheckbox} from '../../../utils/uiComponents';
import {Col, Form, FormGroup, ControlLabel, Panel} from '../../../utils/uiComponents';

const AnalyticsSettings = ({ ...props }) => (
    <Panel>
        <Panel.Heading>
            <Panel.Title componentClass="h3">Analytics Settings</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
        <Form horizontal className='u-gapTop2x'>
            <FormGroup>
                <Col componentClass={ControlLabel} xs={2}> Enable Adobe Analytics </Col>
                <Col xs={4}>
                    <Field name='analyticsEnabled' component={renderCheckbox} />
                </Col>
            </FormGroup>
        </Form>
        </Panel.Body>
    </Panel>
)

export default connect()(AnalyticsSettings);

export const formConfig = {
    settingsToFormValues(values, settings, meta) {
        const {
            analytics = {}
        } = settings;

        return {
            ...values,
            analyticsEnabled : !!analytics.enabled
        }
    },
    formValuesToSettings(settings, values) {
        const analytics = {
            // This will be useful if we support multiple analytics solutions.
            type: 'adobe-video-analytics',
            enabled : !!values.analyticsEnabled
        }
        
        return {
            ...settings,
            analytics
        }
    },
    validate(errors, values) {
        return errors;
    }
};