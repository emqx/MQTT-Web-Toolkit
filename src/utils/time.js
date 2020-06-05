import moment from 'moment'

const getNowDate = (format = 'YYYY-MM-DD HH:mm:ss') => moment().format(format)

const convertSecondsToMs = seconds => seconds * 1000

export default {
  getNowDate,
  convertSecondsToMs,
}
