/***************************************************************************************
* Copyright 2018 Adobe. All rights reserved.
* This file is licensed to you under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License. You may obtain a copy
* of the License at http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software distributed under
* the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
* OF ANY KIND, either express or implied. See the License for the specific language
* governing permissions and limitations under the License.
***************************************************************************************/

import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import * as validators from '../../../utils/validators';

import {
  Col,
  Form,
  FormGroup,
  ControlLabel,
  Panel,
  renderTextField
} from '../../../utils/uiComponents';


const VideoSettings = () => (
  <Panel>
    <Panel.Heading>
      <Panel.Title componentClass="h3">Video Settings</Panel.Title>
    </Panel.Heading>
    <Panel.Body>
      <Form horizontal className="u-gapTop2x">
        <FormGroup>
          <Col componentClass={ ControlLabel } xs={ 2 }> Video Id </Col>
          <Col xs={ 4 }>
            <Field
              name="videoId"
              placeholder="Video Id"
              component={ renderTextField }
              supportDataElement
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ ControlLabel } xs={ 2 }> Video Url </Col>
          <Col xs={ 4 }>
            <Field
              name="videoUrl"
              placeholder="Video URL"
              component={ renderTextField }
              supportDataElement
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ ControlLabel } xs={ 2 }> Optional Video Metadata </Col>
          <Col xs={ 4 }>
            <Field
              name="videoMetadata"
              placeholder="Video Metadata"
              component={ renderTextField }
              supportDataElement
            />
          </Col>
        </FormGroup>
      </Form>
    </Panel.Body>
  </Panel>
);

export default connect()(VideoSettings);

export const formConfig = {
  settingsToFormValues(values, settings/*, meta*/) {
    const {
      media = {}
    } = settings;

    let videoMetadata = '';
    try {
      if (media.metadata) {
        videoMetadata = JSON.stringify(media.metadata);
      }
    } catch (ex) {
      // ex
    }

    return {
      ...values,
      videoId: media.id,
      videoUrl: media.url,
      videoMetadata
    };
  },
  formValuesToSettings(settings, values) {
    const media = {
      id: values.videoId,
      url: values.videoUrl
    };

    {
      let metadata;
      if (validators.isJSON(values.videoMetadata)) {
        metadata = JSON.parse(values.videoMetadata);
      } else if (validators.isSingleDataElementToken(values.videoMetadata)) {
        metadata = values.videoMetadata;
      }
      if (metadata) {
        media.metadata = metadata;
      }
    }

    return {
      ...settings,
      media
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.videoMetadata &&
      !validators.isJSON(values.videoMetadata) &&
      !validators.isSingleDataElementToken(values.videoMetadata)) {
      errors.videoMetadata = 'Please provide metadata K/V pairs ' +
        'either as valid JSON String or DataElement';
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
