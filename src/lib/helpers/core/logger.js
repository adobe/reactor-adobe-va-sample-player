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

export default class Logger {
  static log(tag, msg) {
    turbine.logger.log(`[${tag}] - ${msg}`);
  }

  static info(tag, msg) {
    turbine.logger.info(`[${tag}] - ${msg}`);
  }

  static warn(tag, msg) {
    turbine.logger.warn(`[${tag} - ${msg}`);
  }

  static error(tag, msg) {
    turbine.logger.error(`[${tag}] - ${msg}`);
  }
}
