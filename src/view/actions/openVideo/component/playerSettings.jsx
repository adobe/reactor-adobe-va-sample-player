/*************************************************************************
* ADOBE CONFIDENTIAL
* Copyright 2018 Adobe
* All Rights Reserved.
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
**************************************************************************/

import React from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';

import * as validators from '../../../utils/validators';
import {
  Col,
  Form,
  FormGroup,
  ControlLabel,
  Panel,
  Item,
  renderCheckbox,
  renderRadio,
  renderTextField
} from '../../../utils/uiComponents';

const PlayerSpecificity = {
  items: [
    Item('automatic', 'Automatic'),
    Item('manual', 'Manual')
  ]
};

const PlayerSettings = ({ ...props }) => {
  const { playerSpecificity } = props;
  return (
    <Panel>
      <Panel.Heading>
        <Panel.Title componentClass="h3">Player Settings</Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        <Form horizontal className="u-gapTop2x">
          <FormGroup >
            <Col componentClass={ ControlLabel } xs={ 2 }> Player ID </Col>
            <Col xs={ 4 }>
              <Field
                name="playerSpecificity"
                defaultChecked={ playerSpecificity }
                options={ PlayerSpecificity.items }
                component={ renderRadio }
              />
            </Col>
          </FormGroup>
          {
            (playerSpecificity === 'manual') ?
              <FormGroup>
                <Col xsOffset={ 2 } xs={ 4 }>
                  <Field
                    name="playerId"
                    placeholder="Player Id"
                    component={ renderTextField }
                    supportDataElement
                  />
                </Col>
              </FormGroup>
            : null
            }
          <FormGroup >
            <Col componentClass={ ControlLabel } xs={ 2 }> CSS Selector </Col>
            <Col xs={ 4 }>
              <Field
                name="playerSelector"
                placeholder="CSS Selector"
                component={ renderTextField }
                supportDataElement
              />
            </Col>
          </FormGroup>
          <FormGroup >
            <Col componentClass={ ControlLabel } xs={ 2 }> Player Width (px) </Col>
            <Col xs={ 2 }>
              <Field
                name="playerWidth"
                placeholder="Width"
                component={ renderTextField }
                supportDataElement
              />
            </Col>
          </FormGroup>
          <FormGroup >
            <Col componentClass={ ControlLabel } xs={ 2 }> Player Height (px) </Col>
            <Col xs={ 2 }>
              <Field
                name="playerHeight"
                placeholder="Height"
                component={ renderTextField }
                supportDataElement
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ ControlLabel } xs={ 2 }> Enable Controls </Col>
            <Col xs={ 2 }>
              <Field name="playerControls" component={ renderCheckbox } />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ ControlLabel } xs={ 2 }> Autoplay </Col>
            <Col xs={ 2 }>
              <Field name="playerAutoplay" component={ renderCheckbox } />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ ControlLabel } xs={ 2 }> Muted </Col>
            <Col xs={ 2 }>
              <Field name="playerMuted" component={ renderCheckbox } />
            </Col>
          </FormGroup>
        </Form>
      </Panel.Body>
    </Panel>
  );
};

export default connect(state => ({
  playerSpecificity: formValueSelector('default')(state, 'playerSpecificity')
}))(PlayerSettings);

export const formConfig = {
  settingsToFormValues(values, settings, meta) {
    const {
      player = {}
    } = settings;

    return {
      ...values,
      playerSpecificity: meta.isNew || !player.id ? 'automatic' : 'manual',
      playerId: player.id,
      playerSelector: player.selector,
      playerWidth: player.width,
      playerHeight: player.height,
      playerControls: !!player.control,
      playerAutoplay: !!player.autoplay,
      playerMuted: !!player.muted
    };
  },
  formValuesToSettings(settings, values) {
    const player = {
    // This will be useful if we support multiple players.
      type: 'videoTag',
      selector: values.playerSelector,
      width: values.playerWidth,
      height: values.playerHeight,
      controls: !!values.playerControls,
      autoplay: !!values.playerAutoplay,
      muted: !!values.playerMuted
    };

    if (values.playerSpecificity === 'manual') {
      player.id = values.playerId;
    }

    return {
      ...settings,
      player
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.playerSpecificity !== 'automatic' && !values.playerId) {
      errors.playerId = 'Please provide a player ID.';
    }

    if (!values.playerSelector) {
      errors.playerSelector = 'Please provide a valid CSS Selector to append the player.';
    }

    if (!validators.isPositiveNumber(values.playerWidth)) {
      errors.playerWidth = 'Please provide a valid width.';
    }

    if (!validators.isPositiveNumber(values.playerHeight)) {
      errors.playerHeight = 'Please provide a valid height.';
    }

    return errors;
  }
};
