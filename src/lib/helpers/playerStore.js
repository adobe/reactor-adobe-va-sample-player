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

import Logger from './core/logger';

const LOG_TAG = 'helpers/playerStore';

const playerStore = {};
const launchListeners = [];

function attachListener(player, listener) {
  const playerId = player.id;

  if (listener.playerId && listener.playerId !== playerId) {
    return;
  }

  Logger.info(LOG_TAG, `Attaching Launch event listener for event ${listener.type} to player [${playerId}]`);
  player.on(listener.type, (playerEvent) => {
    listener.trigger({
      playerId,
      playerEvent
    });
  });
}

export function registerPlayer(player) {
  const playerId = player.id;
  if (playerId in playerStore) {
    Logger.error(LOG_TAG, `Can not register player with duplicate playerId [${playerId}].`);
    throw new Error(`Can not register player with duplicate playerId [${playerId}].`);
  }

  playerStore[playerId] = player;

  Logger.info(LOG_TAG, `Attaching queued Launch player events for player [${playerId}]`);

  // Make sure, we iterate through all listeners and attach matching ones to this player.
  launchListeners.forEach(listener => attachListener(player, listener));
}

export function registerListener(type, playerId, trigger) {
  if (!type || !trigger) {
    return;
  }

  const listener = { type, trigger, playerId };
  launchListeners.push(listener);

  // Make sure, we iterate through all the available players and attach this listener.
  Object.keys(playerStore).forEach(playedId => attachListener(playerStore[playedId], listener));
}
