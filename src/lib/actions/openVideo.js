/*************************************************************************
* ADOBE CONFIDENTIAL
* Copyright [2018] Adobe
* All Rights Reserved.
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
**************************************************************************/

import document from '@adobe/reactor-document';
import Logger from '../helpers/core/logger';
import PlayerFacade from '../helpers/playerFacade';
import * as PlayerStore from '../helpers/playerStore';

const LOG_TAG = 'actions/openvideo';

let DOMLoaded = false;
let queueActions = [];

function openVideo(settings) {
  let player;
  try {
    Logger.info(LOG_TAG, `Executing action with ${JSON.stringify(settings)}`);

    player = new PlayerFacade(settings);
    PlayerStore.registerPlayer(player);
    player.load(settings.media);
  } catch (ex) {
    Logger.error(LOG_TAG, `Creating player for action openVideo failed with error ${ex.message}`);

    // Cleanup from DOM.
    if (player) {
      player.destroy();
    }
  }
}

if (document.readyState === 'complete'
   || document.readyState === 'loaded'
   || document.readyState === 'interactive') {
  DOMLoaded = true;
} else {
  document.addEventListener('DOMContentLoaded', () => {
    DOMLoaded = true;
    Logger.info(LOG_TAG, 'Executing queued actions');
    queueActions.forEach(settings => openVideo(settings));
    queueActions = [];
  });
}

export default function(settings) {
  if (!DOMLoaded) {
    Logger.info(LOG_TAG, 'Queuing action till DOMContentLoaded event is fired.');
    queueActions.push(settings);
  } else {
    openVideo(settings);
  }
}
