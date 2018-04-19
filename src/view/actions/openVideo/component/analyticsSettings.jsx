import React from 'react';
import { connect } from 'react-redux'
import { Field, formValueSelector, } from 'redux-form';


import {renderCheckbox} from '../../../utils/uiComponents';
import {Col, Form, FormGroup, ControlLabel, Panel, HelpBlock} from '../../../utils/uiComponents';

const AnalyticsSettings = ({ analyticsEnabled, ...props }) => (
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
            {
                analyticsEnabled && 
                <FormGroup validationState="success">
                    <Col xs={4}>
                        <HelpBlock>
                            Make sure to also configure the following extensions. 
                            <ul>
                                <li>Experience Cloud ID Service</li> 
                                <li> Adobe Analytics </li>
                                <li> Adobe Analytics for Video </li>
                            </ul>
                        </HelpBlock>
                    </Col>
                </FormGroup>
            }
            </FormGroup>
        </Form>
        </Panel.Body>
    </Panel>
)

export default connect(
    state => ({ analyticsEnabled: formValueSelector('default')(state, 'analyticsEnabled')})
)(AnalyticsSettings);

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