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