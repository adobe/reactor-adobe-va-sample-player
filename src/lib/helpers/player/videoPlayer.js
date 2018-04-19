export default class VideoPlayer {
  constructor(dispatcher) {
    this._dispatcher = dispatcher;
  }

  open() {}

  destroy() {}

  play() {}

  pause() {}

  get id() { throw new Error('Not Implemented'); }

  get volume() { throw new Error('Not Implemented'); }

  set volume(level) { throw new Error('Not Implemented'); }

  get currentTime() { throw new Error('Not Implemented'); }

  set currentTime(time) { throw new Error('Not Implemented'); }

  get qosInfo() { throw new Error('Not Implemented'); }

  on(type, fn, ctx) {
    this._dispatcher.on(type, fn, ctx);
  }

  off(type, fn, ctx) {
    this._dispatcher.off(type, fn, ctx);
  }

  trigger(event) {
    this._dispatcher.trigger(event);
  }
}
