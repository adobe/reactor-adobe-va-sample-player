/***************************************************************************************
* Copyright 2018 Adobe. All rights reserved.
* This file is licensed to you under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License. You may obtain a copy
* of the License at http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software distributed under
* the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
* OF ANY KIND, either express or implied. See the License for the specific language
* governing permissions and limitations under the License.
***************************************************************************************/

export default class EventDispatcher {
  constructor() {
    this._listeners = {};
  }

  on(type, fn, ctx) {
    if (!type) {
      throw new Error('Event type should be valid');
    }

    if (!fn || typeof fn !== 'function') {
      throw new Error(`Listener should be a function: ${fn}`);
    }

    this._listeners[type] = this._listeners[type] || [];

    const found = this._listeners[type].find(listener => listener.fn === fn && listener.ctx === ctx);

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
      Object.keys(this._listeners).forEach((eventType) => {
        this._removeListeners(eventType, fn, ctx);
      });
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
    listeners.forEach((listener) => {
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

    listeners = listeners.filter((listener) => {
      const match = (!fn || listener.fn === fn) && (!ctx || listener.ctx === ctx);
      return !match;
    });

    this._listeners[type] = listeners;
  }
}
