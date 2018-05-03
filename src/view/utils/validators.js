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

export const isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (ex) {
    return false;
  }
};

export const isSingleDataElementToken = value => /^%([^%]+)%$/.exec(value) !== null;

export const isNumber =
  value => (!Number.isNaN(value) && (typeof value !== 'string' || value.trim().length > 0));

export const isPositiveNumber = (value, includeZero) => {
  const lowerBound = includeZero ? 0 : 1;
  return isNumber(value) && Number(value) >= lowerBound;
};

