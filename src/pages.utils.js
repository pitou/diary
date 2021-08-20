export const getRoundedRectPath = (roundedCornersType, x, y, width, height, radius) => {
  const arcParams = `${radius},${radius} 0 0 1`

  switch (roundedCornersType) {
    case 'l':
      return (
        `M ${x + radius},${y} ` +
        `h ${width - radius} ` +
        `v ${height} ` +
        `h ${radius - width} ` +
        `a ${arcParams} ${-radius},${-radius} ` +
        `v ${-height + radius * 2} ` +
        `a ${arcParams} ${radius},${-radius} ` +
        `z`
      )

    case 'r':
      return (
        `M ${x},${y} ` +
        `h ${width - radius} ` +
        `a ${arcParams} ${radius},${radius} ` +
        `v ${height - radius * 2} ` +
        `a ${arcParams} ${-radius},${radius} ` +
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
        `a ${arcParams} ${radius},${-radius} ` +
        `z`
      )

    case 'tr':
      return (
        `M ${x},${y} ` +
        `h ${width - radius} ` +
        `a ${arcParams} ${radius},${radius} ` +
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
        `a ${arcParams} ${-radius},${-radius} ` +
        `v ${-height + radius} ` +
        `z`
      )

    case 'br':
      return (
        `M ${x},${y} ` +
        `h ${width} ` +
        `v ${height - radius} ` +
        `a ${arcParams} ${-radius},${radius} ` +
        `h ${-width + radius} ` +
        `z`
      )

    default:
      return `M ${x},${y} h ${width} v ${height} h ${-width} z`
  }
}

export const getContinuationLine = (continuation, params) => {
  const { roundedCornersType, blockX, blockY, blockWidth, blockHeight, radius } = params

  switch (roundedCornersType) {
    case 'l':
      if (continuation === 'prev') {
        return `${getContinuationLine('prev', {
          ...params,
          roundedCornersType: 'tl',
        })} `
      }
      if (continuation === 'next') {
        return `${getContinuationLine('next', {
          ...params,
          roundedCornersType: 'bl',
        })}`
      }
      return continuation === 'both'
        ? `${getContinuationLine('prev', params)} ${getContinuationLine('next', params)}`
        : ''

    case 'r':
      if (continuation === 'prev') {
        return `${getContinuationLine('prev', {
          ...params,
          roundedCornersType: 'tr',
        })} `
      }
      if (continuation === 'next') {
        return `${getContinuationLine('next', {
          ...params,
          roundedCornersType: 'br',
        })}`
      }
      return continuation === 'both'
        ? `${getContinuationLine('prev', params)} ${getContinuationLine('next', params)}`
        : ''

    case 'tl':
      return continuation === 'prev'
        ? `M ${blockX + radius},${blockY} h ${blockWidth - radius}`
        : ''

    case 'tr':
      return continuation === 'prev' ? `M ${blockX},${blockY} h ${blockWidth - radius}` : ''

    case 'bl':
      return continuation === 'next'
        ? `M ${blockX + radius},${blockY + blockHeight} h ${blockWidth - radius}`
        : ''

    case 'br':
      return continuation === 'next'
        ? `M ${blockX},${blockY + blockHeight} h ${blockWidth - radius}`
        : ''
  }
}
