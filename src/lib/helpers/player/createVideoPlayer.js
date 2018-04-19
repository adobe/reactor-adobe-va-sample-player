import Logger from '../core/logger';
import * as videoTag from './videoTagPlayer';

export default function createVideoPlayer(settings = {}, dispatcher) {
  switch (settings.type) {
    case videoTag.Type:
      return new videoTag.Player(settings, dispatcher);
  }

  Logger.warn(`No matching Player for type ${settings.type}`);
  return null;
}
