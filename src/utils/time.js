import moment from 'moment'


const getNowDate = (format = 'YYYY-MM-DD HH:mm:ss') => moment().format(format)


export default getNowDate
