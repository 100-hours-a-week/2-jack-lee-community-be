import moment from 'moment';
import db from '../config/dbConfig.js';

const queryLogger = (req, res, next) => {
    // 이미 확장된 경우 확장 작업 생략
    if (!db._isLoggingEnhanced) {
        // 기존 execute 메서드 참조
        const originalExecute = db.execute;

        // execute 메서드 확장
        db.execute = function (...args) {
            const sql = args[0]; // 실행되는 SQL 쿼리
            const params = args[1]; // 바인딩된 파라미터
            const time = moment().format('YYYY-MM-DD HH:mm:ss');

            console.log(`[${time}]`.cyan + ' Executed SQL: '.yellow + sql.bold);

            if (params) {
                console.log('With parameters:'.magenta, params);
            }

            // 원래의 execute 메서드 호출
            return originalExecute.apply(this, args);
        };

        // 확장 플래그 추가
        db._isLoggingEnhanced = true;
    }

    // 항상 next() 호출
    next();
};

export default queryLogger;
