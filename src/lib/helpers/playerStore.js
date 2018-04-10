import Logger from './core/logger';

const LOG_TAG = 'helpers/playerStore';

const store = {};
const pendingLaunchEvents = {};

function listenEvent(player, event) {
    const playerId = player.id;
    Logger.info(LOG_TAG, `Attaching event ${event} for player [${playerId}]`);
    player.on(event.type, (playerEvent) => {
        event.trigger({
            playerId,             
            playerEvent
        });
    });
}

export function registerPlayer(playerId, player) {
    if (playerId in store) {
        Logger.error(LOG_TAG, `Can not register player with duplicate playerId [${playerId}].`);
        throw new Error(`Can not register player with duplicate playerId [${playerId}].`);
    }

    Logger.info(LOG_TAG, `Attaching queued Launch player events for player [${playerId}]`);
    if (playerId in pendingLaunchEvents) {
        pendingLaunchEvents[playerId].forEach(event => listenEvent(player, event));
    }

    store[playerId] = player;
}

export function registerEvent(playerId, type, trigger) {
    const event = {type, trigger};
    if (!(playerId in store)) {
        Logger.info(LOG_TAG, `Queueing Launch player events for player [${playerId}] as it is not registered in store.`);
        if (!pendingLaunchEvents[playerId]) {
            pendingLaunchEvents[playerId] = [];
        }
        pendingLaunchEvents[playerId].push(event);
        return;
    }

    listenEvent(store[playerId], event);
}