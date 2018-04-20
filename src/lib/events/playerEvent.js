import Logger from '../helpers/core/logger';
import * as PlayerStore from '../helpers/playerStore';

const LOG_TAG = 'events/playerEvent';

export default function(settings, trigger) {
  if (!settings.playerEvent) {
    Logger.error(LOG_TAG, 'No playerEvent passed into playerEvent.');
    return;
  }

  PlayerStore.registerListener(settings.playerEvent, settings.playerId, trigger);
}
