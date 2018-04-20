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
