import React from 'react';
import { connect } from 'react-redux';

import PlayerSettings, { formConfig as PlayerSettingsFormConfig } from './component/playerSettings';
import AnalyticsSettings, { formConfig as AnalyticsSettingsFormConfig } from './component/analyticsSettings';
import VideoSettings, { formConfig as VideoSettingsFormConfig } from './component/videoSettings';


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

