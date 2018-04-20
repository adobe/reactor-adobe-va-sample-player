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
import { Provider, connect } from 'react-redux';
import { createStore, compose } from 'redux';
import { reduxForm } from 'redux-form';

import reducer from './reduxActions/reducer';
import bridgeAdapter from './bridgeAdapter';

module.exports = (View, formConfig, extensionBridge = window.extensionBridge, viewProps) => {
  /* eslint-disable no-underscore-dangle */
  const finalCreateStore = compose(window.__REDUX_DEVTOOLS_EXTENSION__ ?
    window.__REDUX_DEVTOOLS_EXTENSION__() :
    f => f)(createStore);

  const store = finalCreateStore(reducer, {});

  const ViewWrapper = props => (props.initializedByBridge ?
    <View { ...props } componentsWithErrors={ props.error || [] } /> :
    null);

  const ReduxView = connect(({ initializedByBridge }) => ({ initializedByBridge }))(ViewWrapper);

  const ReduxFormView = reduxForm({
    form: 'default',
    // Proxy the provided validate reducer using a function that matches what redux-form expects.
    // Note that there's no technical reason why config.validate must be a reducer. It does
    // maintain some consistency with settingsToFormValues and formValuesToSettings.
    validate: formConfig.validate ?
      (values) => {
        const errors = formConfig.validate({}, values, store.getState().meta);
        return {
          ...errors,
          // A general form-wide error can be returned via the special _error key.
          // From: http://redux-form.com/6.0.5/examples/submitValidation/
          // If there are no components with errors, we need to set it to undefined instead of an
          // empty array or redux-form will consider the form invalid.
          _error: errors.componentsWithErrors && errors.componentsWithErrors.length ?
            errors.componentsWithErrors : undefined
        };
      } :
      undefined,
    // ReduxForm will complain when we try to "submit" the form and don't have onSubmit defined.
    onSubmit: () => {}
  })(ReduxView);

  bridgeAdapter(extensionBridge, store, formConfig);

  return (
    <Provider store={ store }>
      <ReduxFormView { ...viewProps } />
    </Provider>
  );
};
