const morgan = require('morgan');

const loggerMiddleware = morgan('combined'); // HTTP 요청을 콘솔에 로깅

module.exports = loggerMiddleware;
