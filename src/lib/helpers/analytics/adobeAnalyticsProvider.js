/*************************************************************************
* ADOBE CONFIDENTIAL
* Copyright 2018 Adobe
* All Rights Reserved.
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
**************************************************************************/

import Logger from '../core/logger';
import PlayerEvent from '../player/playerEvents';
import AnalyticsProvider from './analyticsProvider';

const LOG_TAG = 'helpers/analytics/adobeAnalyticsProvider';

const getMediaHeartbeatInstance = turbine.getSharedModule('adobe-video-analytics', 'get-instance');
const MediaHeartbeat = turbine.getSharedModule('adobe-video-analytics', 'media-heartbeat');

export const Type = 'adobe-video-analytics';

export class Provider extends AnalyticsProvider {
  constructor(settings, player) {
    super();
    if (!getMediaHeartbeatInstance || !MediaHeartbeat) {
      throw new Error('Adobe Analytics for Video extension is not configured.');
    }

    this._player = player;
    this._internalError = false;
    this._trackingVideo = false;
    this._queuedEvents = [];

    this._createTracker();
    this._addListeners();
  }

  destroy() {
    if (this._player) {
      this._removeListeners();
      this._player = null;
    }

    this._internalError = false;
    this._trackingVideo = false;
  }

  _addListeners() {
    const playbackEvents = [PlayerEvent.MediaLoaded, PlayerEvent.MediaComplete, PlayerEvent.MediaAbort,
      PlayerEvent.MediaError, PlayerEvent.MediaPlay, PlayerEvent.MediaPause, PlayerEvent.MediaBufferStart,
      PlayerEvent.MediaBufferEnd, PlayerEvent.MediaSeekStart, PlayerEvent.MediaSeekEnd, PlayerEvent.MediaBitrateChange
    ];

    playbackEvents.forEach((type) => {
      this._player.on(type, this._eventHandler, this);
    });
  }

  _removeListeners() {
    // Remove all listeners registered by this object.
    this._player.on(null, null, this);
  }

  _createTracker() {
    this._creatingTracker = true;

    const delegate = {
      getCurrentPlaybackTime: () => {
        if (this._player) {
          const time = this._player.currentTime;
          return !Number.isNaN(time) ? time : 0;
        }
        return 0;
      },
      getQoSObject: () => {
        if (this._player) {
          const qos = this._player.qosInfo;
          return MediaHeartbeat.createQoSObject(qos.bitrate, qos.droppedFrames, qos.fps, qos.startTime);
        }
        return null;
      }
    };

    const config = {};
    return getMediaHeartbeatInstance(delegate, config).then((instance) => {
      this._mediaHeartbeat = instance;

      this._creatingTracker = false;

      // Send pending events. Mostly (trackSessionStart, trackPlay).
      this._queuedEvents.forEach((event) => {
        this._eventHandler(event);
      });
      this._queuedEvents = [];

      return instance;
    }).catch((err) => {
      Logger.warn(LOG_TAG, `Creating Video Analytics tracker failed ${err}`);
      this._creatingTracker = false;
      this._internalError = true;
      this._removeListeners();
    });
  }

  _eventHandler(evt) {
    if (this._internalError) {
      return;
    }

    if (this._creatingTracker) {
      if (evt.type === PlayerEvent.MediaLoaded ||
                evt.type === PlayerEvent.MediaPlay ||
                evt.type === PlayerEvent.MediaPause) {
        this._queuedEvents.push(evt);
      }
      return;
    }

    switch (evt.type) {
      case PlayerEvent.MediaLoaded: {
        // Close current tracking session.
        if (this._trackingVideo) {
          this._mediaHeartbeat.trackSessionEnd();
          this._trackingVideo = false;
        }

        const {
          id = 'defaultId',
          length = -1,
          metadata: {
            name = id,
            ...metadata
          } = {}
        } = evt.info;

        const mediaInfo = MediaHeartbeat.createMediaObject(
          name,
          id,
          length,
          MediaHeartbeat.StreamType.VOD
        );

        this._mediaHeartbeat.trackSessionStart(mediaInfo, metadata);
        this._trackingVideo = true;
        break;
      }
      case PlayerEvent.MediaPlay:
        this._mediaHeartbeat.trackPlay();
        break;
      case PlayerEvent.MediaPause:
        this._mediaHeartbeat.trackPause();
        break;
      case PlayerEvent.MediaSeekStart:
        this._mediaHeartbeat.trackEvent(MediaHeartbeat.Event.SeekStart);
        break;
      case PlayerEvent.MediaSeekEnd:
        this._mediaHeartbeat.trackEvent(MediaHeartbeat.Event.SeekComplete);
        break;
      case PlayerEvent.MediaBufferStart:
        this._mediaHeartbeat.trackEvent(MediaHeartbeat.Event.BufferStart);
        break;
      case PlayerEvent.MediaBufferEnd:
        this._mediaHeartbeat.trackEvent(MediaHeartbeat.Event.BufferComplete);
        break;
      case PlayerEvent.MediaBitrateChange:
        this._mediaHeartbeat.trackEvent(MediaHeartbeat.Event.BitrateChange);
        break;
      case PlayerEvent.MediaError:
        this._mediaHeartbeat.trackError(`Player Error : ${evt.info.error}`);
        break;
      case PlayerEvent.MediaComplete:
        this._mediaHeartbeat.trackComplete();
        // eslint-disable-next-line no-fallthrough
      case PlayerEvent.MediaAbort:
        this._mediaHeartbeat.trackSessionEnd();
        this._trackingVideo = false;
        break;
    }
  }
}
