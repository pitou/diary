export const getPagesData = (data) => {
  return Object.values(data).reduce((acc, dd, dayIndex) => {
    Object.entries(dd).forEach(([key, val]) => {
      if (/\d{4}\/\d{2}\/\d{2}/.test(key) && val !== null) {
        if (!acc[dayIndex]) {
          acc[dayIndex] = []
        }
        acc[dayIndex].push({ date: key, val, dayIndex })
      }
    })
    return acc
  }, {})
}
