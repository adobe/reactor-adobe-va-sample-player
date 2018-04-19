export default class PlayerEvent {
  constructor(type, info = {}) {
    this.type = type;
    this.info = info;
  }
}

PlayerEvent.MediaLoadStart = 'MediaLoadStart';
PlayerEvent.MediaLoaded = 'MediaLoaded';
PlayerEvent.MediaComplete = 'MediaComplete';
PlayerEvent.MediaAbort = 'MediaAbort';
PlayerEvent.MediaError = 'MediaError';
PlayerEvent.MediaPlay = 'MediaPlay';
PlayerEvent.MediaPause = 'MediaPause';
PlayerEvent.MediaBufferStart = 'MediaBufferStart';
PlayerEvent.MediaBufferEnd = 'MediaBufferEnd';
PlayerEvent.MediaSeekStart = 'MediaSeekStart';
PlayerEvent.MediaSeekEnd = 'MediaSeekEnd';
PlayerEvent.MediaBitrateChange = 'MediaBitrateChange';
PlayerEvent.MediaTimeUpdate = 'MediaTimeUpdate';
