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

import reduceReducers from 'reduce-reducers';
import { reducer as formReducer } from 'redux-form';
import bridgeAdapterActions from './bridgeAdapterActions';

export default reduceReducers(
  bridgeAdapterActions,

  //Setup for redux-form.
  (state, action) => ({
    ...state,
    form: formReducer(state.form, action)
  })
);
