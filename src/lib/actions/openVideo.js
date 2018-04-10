import document from '@adobe/reactor-document';
import Logger from '../helpers/core/logger';
import PlayerFacade from '../helpers/playerFacade';
import * as PlayerStore from '../helpers/playerStore';

const LOG_TAG = 'actions/openvideo';

let DOMLoaded = false;
let queueActions = [];

function openVideo(settings) {
    try {
        Logger.info(LOG_TAG, `Executing action with ${JSON.stringify(settings)}`);
        const player = new PlayerFacade(settings);
        PlayerStore.registerPlayer(player.id , player);
        player.load(settings.media);
    } catch (ex) {
        Logger.error(LOG_TAG, `Creating player for action openVideo failed with error ${ex.message}`);
    }
}

if (document.readyState === 'complete' 
     || document.readyState === 'loaded' 
     || document.readyState === 'interactive') {
    DOMLoaded = true;
} else {
    document.addEventListener('DOMContentLoaded' , () => {
        DOMLoaded = true;
        Logger.info(LOG_TAG, 'Executing queued actions');
        queueActions.map(settings => openVideo(settings));
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
