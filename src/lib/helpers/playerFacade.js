import Logger from './core/logger';
import EventDispatcher from './core/eventDispatcher';
import createVideoPlayer from './player/createVideoPlayer';
import createAnalyticsProvider from './analytics/createAnalyticsProvider';

const LOG_TAG = 'helpers/playerFacade';

export default class PlayerFacade {
  constructor(config) {
    this._dispatcher = new EventDispatcher();
    this.configure(config);
  }

  configure(config = {}) {
    let player;
    try {
      if (config.player && typeof config.player === 'object') {
        player = createVideoPlayer(config.player, this._dispatcher);
      }
    } catch (ex) {
      Logger.error(LOG_TAG, `Creating player failed with ${ex}`);
      throw ex;
    }

    let analyticsProvider;
    try {
      if (config.analytics && typeof config.analytics === 'object') {
        if (config.analytics.enabled) {
          analyticsProvider = createAnalyticsProvider(config.analytics, player);
        } else {
          Logger.info(LOG_TAG, 'Video Analytics has been disabled in configuration');
        }
      }
    } catch (ex) {
      Logger.warn(LOG_TAG, `Creating analytics provider failed with ${ex}`);
    }

    // Other functionalities like Ad Resolution, Custom UI can be initialized here.

    this._player = player;
    this._analyticsProvider = analyticsProvider;
  }

  destroy() {
    Logger.info(LOG_TAG, 'Destroying PlayerFacade.');
    if (this._player) {
      this._player.destroy();
      this._player = null;
    }

    if (this._analyticsProvider) {
      this._analyticsProvider.destroy();
      this._analyticsProvider = null;
    }
  }

  load(mediaConfig = {}) {
    if (!this._player) {
      Logger.warn(LOG_TAG, 'Media playback failed as we have no valid player instance');
      return;
    }

    if (mediaConfig && typeof mediaConfig === 'object') {
      this._player.open(mediaConfig);
    }
  }

  on(type, fn, ctx) {
    this._dispatcher.on(type, fn, ctx);
  }

  off(type, fn, ctx) {
    this._dispatcher.off(type, fn, ctx);
  }

  get id() {
    if (!this._player) {
      Logger.warn(LOG_TAG, 'No valid player instance');
      throw new Error('No valid player instance');
    }

    return this._player.id;
  }
}
