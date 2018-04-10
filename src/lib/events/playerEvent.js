import Logger from '../helpers/core/logger';
import * as PlayerStore from '../helpers/playerStore';

const LOG_TAG = 'events/playerEvent';

export default function(settings, trigger) {
    if (!settings.playerId) {
        Logger.error(LOG_TAG, 'Invalid playerId passed into playerEvent');
        return;
    }

    if (!settings.eventType) {
        Logger.error(LOG_TAG, 'Invalid eventType passed into playerEvent');
        return;
    }

    PlayerStore.registerEvent(settings.playerId, settings.eventType, trigger);
};