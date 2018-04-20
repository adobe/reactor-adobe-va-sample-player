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

import document from '@adobe/reactor-document';
import Logger from '../core/logger';
import generateId from '../core/generateId';
import VideoPlayer from './videoPlayer';
import PlayerEvent from './playerEvents';

const LOG_TAG = 'helpers/player/videoTagPlayer';

export const Type = 'videoTag';

export class Player extends VideoPlayer {
  constructor(settings = {}, dispatcher) {
    super(dispatcher);

    this._id = settings.id ? settings.id : generateId();
    this._autoplay = !!settings.autoplay;
    this._configureView(settings);
    this._addListeners();
  }

  destroy() {
    this._removeListeners();

    try {
      if (this._videoTag.parentElement === this._parent) {
        this._parent.removeChild(this._videoTag);
      }
    } catch (ex) {
      // Do nothing.
    }

    this._parent = null;
    this._videoTag = null;
  }

  open(media = {}) {
    if (!media.url) {
      throw new Error('Media URL is invalid.');
    }

    this._currentMedia = {
      id: media.id,
      name: media.name,
      metadata: media.metadata
    };

    this._videoTag.src = media.url;

    if (this._autoplay) {
      this._videoTag.play();
    }
  }

  play() {
    if (this._mediaOpened) {
      this._videoTag.play();
    }
  }

  pause() {
    if (this._mediaOpened) {
      this._videoTag.pause();
    }
  }

  get id() {
    return this._id;
  }

  get volume() {
    return this._videoTag.volume;
  }

  set volume(level) {
    if (level >= 0 && level <= 1) {
      this._videoTag.volume = level;
    }
  }

  get currentTime() {
    return this._videoTag.currentTime;
  }

  set currentTime(time) {
    this._videoTag.currentTime = time;
  }

  get qosInfo() {
    return {};
  }

  _configureView(settings) {
    const parent = settings.selector ? document.querySelector(settings.selector) : null;
    if (!parent) {
      throw new Error('Parent selector is invalid and can not query parent container.');
    }

    const videoTag = document.createElement('video');
    videoTag.id = this._id;

    if (settings.width) {
      videoTag.width = settings.width;
    }

    if (settings.height) {
      videoTag.height = settings.height;
    }

    videoTag.controls = !!settings.controls;
    videoTag.muted = !!settings.muted;
    parent.appendChild(videoTag);

    this._parent = parent;
    this._videoTag = videoTag;
  }

  _triggerEvent({ type, info, supressLog }) {
    if (!this._mediaOpened) {
      return;
    }

    if (!supressLog) {
      Logger.info(LOG_TAG, `${type} dispatched from Player [${this._id}]`);
    }
    this.trigger(new PlayerEvent(type, info));
  }

  _onLoadedMetadata() {
    this._currentMedia.length = !Number.isNaN(this._videoTag.duration) ? this._videoTag.duration : -1;

    this._mediaOpened = true;
    this._triggerEvent({
      type: PlayerEvent.MediaLoaded,
      info: this._currentMedia
    });
  }

  _onPause() {
    this._triggerEvent({
      type: PlayerEvent.MediaPause,
      info: this._currentMedia
    });
  }

  _onPlaying() {
    if (!this._mediaOpened) {
      this._onLoadedMetadata();
    }

    if (this._buffering) {
      this._triggerEvent({
        type: PlayerEvent.MediaBufferEnd
      });
      this._buffering = false;
    }

    this._triggerEvent({
      type: PlayerEvent.MediaPlay
    });
  }

  _onSeeking() {
    this._triggerEvent({
      type: PlayerEvent.MediaSeekStart
    });
  }

  _onSeeked() {
    this._triggerEvent({
      type: PlayerEvent.MediaSeekEnd
    });
  }

  _onWaiting() {
    if (!this._buffering) {
      this._triggerEvent({
        type: PlayerEvent.MediaBufferStart
      });
      this._buffering = true;
    }
  }

  _onEnded() {
    this._triggerEvent({
      type: PlayerEvent.MediaComplete
    });
    this._mediaOpened = false;
  }

  _onAbort() {
    this._triggerEvent({
      type: PlayerEvent.MediaAbort
    });
    this._mediaOpened = false;
  }

  _onError() {
    this._triggerEvent({
      type: PlayerEvent.MediaError,
      info: { error: this._videoTag.error }
    });
    this._mediaOpened = false;
  }

  _onTimeUpdate() {
    this._triggerEvent({
      type: PlayerEvent.MediaTimeUpdate,
      info: { time: this.currentTime },
      supressLog: true
    });
  }

  _addListeners() {
    this._onLoadedMetadata = this._onLoadedMetadata.bind(this);
    this._onPause = this._onPause.bind(this);
    this._onPlaying = this._onPlaying.bind(this);
    this._onSeeking = this._onSeeking.bind(this);
    this._onSeeked = this._onSeeked.bind(this);
    this._onEnded = this._onEnded.bind(this);
    this._onAbort = this._onAbort.bind(this);
    this._onError = this._onError.bind(this);
    this._onWaiting = this._onWaiting.bind(this);
    this._onTimeUpdate = this._onTimeUpdate.bind(this);

    this._videoTag.addEventListener('loadedmetadata', this._onLoadedMetadata);
    this._videoTag.addEventListener('pause', this._onPause);
    this._videoTag.addEventListener('playing', this._onPlaying);
    this._videoTag.addEventListener('seeking', this._onSeeking);
    this._videoTag.addEventListener('seeked', this._onSeeked);
    this._videoTag.addEventListener('ended', this._onEnded);
    this._videoTag.addEventListener('abort', this._onAbort);
    this._videoTag.addEventListener('error', this._onError);
    this._videoTag.addEventListener('waiting', this._onWaiting);
    this._videoTag.addEventListener('timeupdate', this._onTimeUpdate);
  }

  _removeListeners() {
    this._videoTag.removeEventListener('loadedmetadata', this._onLoadedMetadata);
    this._videoTag.removeEventListener('pause', this._onPause);
    this._videoTag.removeEventListener('playing', this._onPlaying);
    this._videoTag.removeEventListener('seeking', this._onSeeking);
    this._videoTag.removeEventListener('seeked', this._onSeeked);
    this._videoTag.removeEventListener('ended', this._onEnded);
    this._videoTag.removeEventListener('abort', this._onAbort);
    this._videoTag.removeEventListener('error', this._onError);
    this._videoTag.removeEventListener('waiting', this._onWaiting);
    this._videoTag.removeEventListener('timeupdate', this._onTimeUpdate);
  }
}
