export const getPagesData = (data) => {
  return Object.values(data).reduce((acc, dd, pageIndex) => {
    Object.entries(dd).forEach(([key, val]) => {
      if (/\d{4}\/\d{2}\/\d{2}/.test(key) && val !== null) {
        if (!acc[pageIndex]) {
          acc[pageIndex] = []
        }
        acc[pageIndex].push({ date: key, val })
      }
    })
    return acc
  }, {})
}
