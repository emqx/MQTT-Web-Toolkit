import moment from 'moment'


const getNowDate = (format = 'YYYY-MM-DD HH:MM:ss') => moment().format(format)


export default getNowDate
