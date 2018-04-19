import Logger from '../core/logger';
import * as adobeAnalytics from './adobeAnalyticsProvider';

export default function createAnalyticsProvider(settings, player) {
  switch (settings.type) {
    case adobeAnalytics.Type:
      return new adobeAnalytics.Provider(settings, player);
  }

  Logger.warn(`No matching Analytics provider for type ${settings.type}`);
  return null;
}
