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
