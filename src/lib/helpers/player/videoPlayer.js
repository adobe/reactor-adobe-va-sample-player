export default class VideoPlayer {

    constructor(dispatcher) {
        this._dispatcher = dispatcher;
    }

    open() {}

    destroy() {}

    play() {}

    pause() {}

    get id() {}

    get volume() {}

    set volume(level) {}

    get currentTime() {}

    set currentTime(time) {}

    get qosInfo() {}

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