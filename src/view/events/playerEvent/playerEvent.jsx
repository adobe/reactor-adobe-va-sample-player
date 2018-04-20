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

import {
  Col,
  Form,
  FormGroup,
  ControlLabel,
  Item,
  renderSelect,
  renderRadio,
  renderTextField
} from '../../utils/uiComponents';


import EventName from '../../../lib/helpers/player/playerEvents';

const EventList = {
  items: [
    Item(EventName.MediaLoadStart, 'Media Load Start'),
    Item(EventName.MediaComplete, 'Media Complete'),
    Item(EventName.MediaAbort, 'Media Abort'),
    Item(EventName.MediaError, 'Media Error'),
    Item(EventName.MediaPlay, 'Media Play'),
    Item(EventName.MediaPause, 'Media Pause'),
    Item(EventName.MediaBufferStart, 'Media Buffer Start'),
    Item(EventName.MediaBufferEnd, 'Media Buffer End'),
    Item(EventName.MediaSeekStart, 'Media Seek Start'),
    Item(EventName.MediaSeekEnd, 'Media Seek End'),
    Item(EventName.MediaBitrateChange, 'Media Bitrate Change'),
    Item(EventName.MediaTimeUpdate, 'Media Time Update')
  ],
  isValidType(type) {
    return !!this.items.find(item => item.value === type);
  },
  get defaultType() { return EventName.MediaLoadStart; }
};

const PlayerSpecificity = {
  items: [
    Item('any', 'Any Player'),
    Item('specific', 'Specific Player')
  ]
};

const PlayerEvent = ({ ...props }) => {
  const { playerSpecificity } = props;
  return (
    <Form horizontal className="u-gapTop2x">
      <FormGroup>
        <Col componentClass={ ControlLabel } xs={ 2 }> Player Event </Col>
        <Col xs={ 4 }>
          <Field
            name="playerEvent"
            componentClass="select"
            options={ EventList.items }
            component={ renderSelect }
          />
        </Col>
      </FormGroup>
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
        (playerSpecificity === 'specific') ?
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
    </Form>
  );
};

export default connect(state => ({
  playerSpecificity: formValueSelector('default')(state, 'playerSpecificity')
}))(PlayerEvent);

export const formConfig = {
  settingsToFormValues(values, settings, meta) {
    const { playerId, playerEvent } = settings;

    return {
      ...values,
      playerId,
      playerSpecificity: meta.isNew || !playerId ? 'any' : 'specific',
      playerEvent: EventList.isValidType(playerEvent) ? playerEvent : EventList.defaultType
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings,
      ...values
    };

    const { playerSpecificity } = values;

    if (playerSpecificity === 'any') {
      delete settings.playerId;
    }

    delete settings.playerSpecificity;

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.playerSpecificity !== 'any' && !values.playerId) {
      errors.playerId = 'Please provide a player ID';
    }
    return errors;
  }
};

