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

import PlayerSettings, { formConfig as PlayerSettingsFormConfig } from './components/playerSettings';
import AnalyticsSettings, { formConfig as AnalyticsSettingsFormConfig } from './components/analyticsSettings';
import VideoSettings, { formConfig as VideoSettingsFormConfig } from './components/videoSettings';


const OpenVideo = () => (
  <div>
    <PlayerSettings />
    <AnalyticsSettings />
    <VideoSettings />
  </div>
);

export default connect()(OpenVideo);

function mergeConfig(...configs) {
  const isFunction = fn => typeof fn === 'function';

  const settingsToFormValuesFns = configs
    .map(config => config.settingsToFormValues)
    .filter(isFunction);

  const formValuesToSettingsFns = configs
    .map(config => config.formValuesToSettings)
    .filter(isFunction);

  const validateFns = configs
    .map(config => config.validate)
    .filter(isFunction);

  return {
    settingsToFormValues(values, settings, meta) {
      return settingsToFormValuesFns.reduce(
        (currentValue, fn) => fn(currentValue, settings, meta),
        values
      );
    },

    formValuesToSettings(settings, values) {
      return formValuesToSettingsFns.reduce(
        (currentValue, fn) => fn(currentValue, values),
        settings
      );
    },

    validate(errors, values) {
      return validateFns.reduce(
        (currentValue, fn) => fn(currentValue, values),
        errors
      );
    }
  };
}

export const formConfig = mergeConfig(
  AnalyticsSettingsFormConfig,
  VideoSettingsFormConfig,
  PlayerSettingsFormConfig
);

