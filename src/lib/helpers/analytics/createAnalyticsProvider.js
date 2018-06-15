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

import Logger from '../core/logger';
import * as adobeAnalytics from './adobeAnalyticsProvider';

const LOG_TAG = 'helpers/analytics/createAnalyticsProvider';

// This approach allows the extension developer to support multiple analytics solutions.
// Analytics type can be selected during action or extension configuration in launch UI and
// passed here through settings.

export default function createAnalyticsProvider(settings, player) {
  switch (settings.type) {
    case adobeAnalytics.Type:
      return new adobeAnalytics.Provider(settings, player);
  }

  Logger.warn(LOG_TAG, `No matching Analytics provider for type ${settings.type}`);
  return null;
}
