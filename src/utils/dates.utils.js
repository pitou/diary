import dayjs from 'dayjs'

export const formatDatesForPopup = (dates) => {
  const d0 = dayjs(dates[0])
  const d1 = dayjs(dates[1])
  if (dates.length === 1) {
    return d0.format('MMM D, YYYY')
  }
  if (dayjs(dates[0]).isSame(dates[1], 'month')) {
    return `${d0.format('MMM D')} to ${d1.format('D, YYYY')}`
  }
  if (dayjs(dates[0]).isSame(dates[1], 'year')) {
    return `${d0.format('MMM D')} to ${d1.format('MMM D, YYYY')}`
  }
  return `${d0.format('MMM D, YYYY')} to ${d1.format('MMM D, YYYY')}`
}
