import Logger from '../helpers/core/logger';
import * as PlayerStore from '../helpers/playerStore';

const LOG_TAG = 'events/playerEvent';

export default function(settings, trigger) {
  if (!settings.eventType) {
    Logger.error(LOG_TAG, 'No eventType passed into playerEvent.');
    return;
  }

  PlayerStore.registerListener(settings.eventType, settings.playerId, trigger);
}
