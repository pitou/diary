export const getRoundedRectPath = (roundedCornersType, x, y, width, height, radius) => {
  switch (roundedCornersType) {
    case 'l':
      return (
        `M ${x + radius},${y} ` +
        `h ${width - radius} ` +
        `v ${height} ` +
        `h ${radius - width} ` +
        `a ${radius},${radius} 0 0 1 ${-radius},${-radius} ` +
        `v ${-height + 2 * radius} ` +
        `a ${radius},${radius} 0 0 1 ${radius},${-radius} ` +
        `z`
      )

    case 'r':
      return (
        `M ${x},${y} ` +
        `h ${width - radius} ` +
        `a ${radius},${radius} 0 0 1 ${radius},${radius} ` +
        `v ${height - 2 * radius} ` +
        `a ${radius},${radius} 0 0 1 ${-radius},${radius} ` +
        `h ${radius - width} ` +
        `z`
      )

    case 'tl':
      return (
        `M ${x + radius},${y} ` +
        `h ${width - radius} ` +
        `v ${height} ` +
        `h ${-width} ` +
        `v ${-height + radius} ` +
        `a ${radius},${radius} 0 0 1 ${radius},${-radius} ` +
        `z`
      )

    case 'tr':
      return (
        `M ${x},${y} ` +
        `h ${width - radius} ` +
        `a ${radius},${radius} 0 0 1 ${radius},${radius} ` +
        `v ${height - radius} ` +
        `h ${-width} ` +
        `z`
      )

    case 'bl':
      return (
        `M ${x},${y} ` +
        `h ${width} ` +
        `v ${height} ` +
        `h ${-width + radius} ` +
        `a ${radius},${radius} 0 0 1 ${-radius},${-radius} ` +
        `v ${-height + radius} ` +
        `z`
      )

    case 'br':
      return (
        `M ${x},${y} ` +
        `h ${width} ` +
        `v ${height - radius} ` +
        `a ${radius},${radius} 0 0 1 ${-radius},${radius} ` +
        `h ${-width + radius} ` +
        `z`
      )

    default:
      return `M ${x},${y} h ${width} v ${height} h ${-width} z`
  }
}
