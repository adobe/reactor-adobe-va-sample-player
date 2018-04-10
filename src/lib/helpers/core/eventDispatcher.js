export default class EventDispatcher {
    constructor() {
        this._listeners = {};
    }

    on(type, fn, ctx) {
        if (!type) {
            throw new Error('Event type should be valid');
        }

        if (!fn || typeof fn !== 'function') {
            throw new Error('Listener should be a function: ' + fn);
        }

        this._listeners[type] = this._listeners[type] || [];

        let found = this._listeners[type].find(listener => listener.fn === fn && listener.ctx === ctx);

        if (!found) {
            this._listeners[type].push({ fn, ctx });
        }
    }

    off(type, fn, ctx) {
        fn = (typeof fn === 'function') ? fn : null;

        if (!type && !fn && !ctx) {
            this._listeners = {};
            return;
        }

        if (!type) {
            for (let eventType in this._listeners) {
                if (this._listeners.hasOwnProperty(eventType)) {
                    this._removeListeners(eventType, fn, ctx);
                }
            }
        } else {
            this._removeListeners(type, fn, ctx);
        }
    }
    
    trigger(event) {
        const eventType = event.type;
        if (!eventType) {
            throw new Error('Event type should be valid.');
        }

        if (!this._listeners[eventType]) {
            return;
        }

        // Make a copy of listeners.
        const listeners = [...this._listeners[eventType]];
        listeners.map( listener => {
            listener.fn.call(listener.ctx, event);
        });
    }

    destroy() {
        this.off();
    }

    _removeListeners(type, fn, ctx) {
        fn = (typeof fn === 'function') ? fn : null;

        let listeners = this._listeners[type];

        if (!listeners) {
            return;
        }

        if (!listeners.length || (!fn && !ctx)) {
            delete this._listeners[type];
            return;
        }
        
        listeners = listeners.filter( listener => {
            const match = (!fn || listener.fn === fn) && (!ctx || listener.ctx === ctx);
            return !match;
        });

        this._listeners[type] = listeners;
    }
}