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

import { createAction, handleActions } from 'redux-actions';

const POPULATE_META = 'bridgeAdapter/POPULATE_META';
const MARK_INIT_COMPLETE = 'bridgeAdapter/MARK_INIT_COMPLETE';

export const actionCreators = {
  populateMeta: createAction(POPULATE_META),
  markInitComplete: createAction(MARK_INIT_COMPLETE)
};

export default handleActions({
  [POPULATE_META]: (state, action) => ({
    ...state,
    meta: {
      ...action.payload
    }
  }),
  [MARK_INIT_COMPLETE]: state => ({
    ...state,
    initializedByBridge: true
  })
}, {});
