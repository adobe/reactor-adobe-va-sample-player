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

import Logger from '../helpers/core/logger';
import * as PlayerStore from '../helpers/playerStore';

const LOG_TAG = 'events/playerEvent';

export default function(settings, trigger) {
  if (!settings.playerEvent) {
    Logger.error(LOG_TAG, 'No playerEvent type passed in settings.');
    return;
  }

  PlayerStore.registerListener(settings.playerEvent, settings.playerId, trigger);
}
