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

