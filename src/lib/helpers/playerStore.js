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

import Logger from './core/logger';

const LOG_TAG = 'helpers/playerStore';

const playerStore = {};
const launchListeners = [];

function attachListener(player, event) {
  const playerId = player.id;
  Logger.info(LOG_TAG, `Attaching Launch event listener for event ${event.type} in player [${playerId}]`);
  player.on(event.type, (playerEvent) => {
    event.trigger({
      playerId,
      playerEvent
    });
  });
}

function attachLaunchListeners(player) {
  const playerId = player.id;
  launchListeners.forEach((listener) => {
    if (!listener.playerId || listener.playerId === playerId) {
      attachListener(player, listener);
    }
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
  attachLaunchListeners(player);
}

export function registerListener(type, playerId, trigger) {
  if (!type || !trigger) {
    return;
  }

  const listener = { type, trigger, playerId };
  launchListeners.push(listener);

  // Make sure, we iterate through all the available players and attach this listener.
  Object.keys(playerStore).forEach(player => attachLaunchListeners(player));
}
