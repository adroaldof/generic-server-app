import winston from 'winston';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      json: true,
      colorize: true
    })
  ]
});

logger.transports.console.level = 'info';

export default logger;
