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

