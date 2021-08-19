export const getRoundedRectPath = (
  roundedCornersType,
  x,
  y,
  width,
  height,
  radius,
  continuation
) => {
  const arcParams = `${radius},${radius} 0 0 1`

  switch (roundedCornersType) {
    case 'l':
      if (continuation === 'prev') {
        return (
          `M ${x + width},${y} ` +
          `v ${height} ` +
          `h ${-width + radius} ` +
          `a ${arcParams} ${-radius},${-radius} ` +
          `v ${-height + radius * 2} ` +
          `a ${arcParams} ${radius},${-radius}`
        )
      }
      if (continuation === 'next') {
        return (
          `M ${x + radius},${y + height} ` +
          `a ${arcParams} ${-radius},${-radius} ` +
          `v ${-height + radius * 2} ` +
          `a ${arcParams} ${radius},${-radius} ` +
          `h ${width - radius} ` +
          `v ${height}`
        )
      }
      if (continuation === 'both') {
        return (
          `M ${x + width},${y} ` +
          `v ${height} ` +
          `M ${x + radius},${y + height} ` +
          `a ${arcParams} ${-radius},${-radius} ` +
          `v ${-height + radius * 2} ` +
          `a ${arcParams} ${radius},${-radius}`
        )
      }
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
      if (continuation === 'prev') {
        return (
          `M ${x + width - radius},${y} ` +
          `a ${arcParams} ${radius},${radius} ` +
          `v ${height - radius * 2} ` +
          `a ${arcParams} ${-radius},${radius}` +
          `h ${-width + radius} ` +
          `v ${-height}`
        )
      }
      if (continuation === 'next') {
        return (
          `M ${x},${y + height} ` +
          `v ${-height} ` +
          `h ${width - radius} ` +
          `a ${arcParams} ${radius},${radius} ` +
          `v ${height - radius * 2} ` +
          `a ${arcParams} ${-radius},${radius}`
        )
      }
      if (continuation === 'both') {
        return (
          `M ${x + width - radius},${y} ` +
          `a ${arcParams} ${radius},${radius} ` +
          `v ${height - radius * 2} ` +
          `a ${arcParams} ${-radius},${radius}` +
          `M ${x},${y + height} ` +
          `v ${-height}`
        )
      }
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
      if (continuation === 'prev') {
        return (
          `M ${x + width},${y} ` +
          `v ${height} ` +
          `h ${-width} ` +
          `v ${-height + radius} ` +
          `a ${arcParams} ${radius},${-radius}`
        )
      }
      if (continuation === 'next') {
        return (
          `M ${x},${y + height} ` +
          `v ${-height + radius} ` +
          `a ${arcParams} ${radius},${-radius} ` +
          `h ${width} ` +
          `v ${height}`
        )
      }
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
      if (continuation === 'prev') {
        return (
          `M ${x + width - radius},${y} ` +
          `a ${arcParams} ${radius},${radius} ` +
          `v ${height - radius} ` +
          `h ${-width} ` +
          `v ${-height}`
        )
      }
      if (continuation === 'next') {
        return (
          `M ${x},${y + height} ` +
          `v ${-height} ` +
          `h ${width - radius} ` +
          `a ${arcParams} ${radius},${radius} ` +
          `v ${height - radius}`
        )
      }
      return (
        `M ${x},${y} ` +
        `h ${width - radius} ` +
        `a ${arcParams} ${radius},${radius} ` +
        `v ${height - radius} ` +
        `h ${-width} ` +
        `z`
      )

    case 'bl':
      if (continuation === 'prev') {
        return (
          `M ${x + width},${y} ` +
          `v ${height} ` +
          `h ${-width} ` +
          `a ${arcParams} ${-radius},${-radius} ` +
          `v ${-height + radius}`
        )
      }
      if (continuation === 'next') {
        return (
          `M ${x + radius},${y + height} ` +
          `a ${arcParams} ${-radius},${-radius} ` +
          `v ${-height + radius} ` +
          `h ${width} ` +
          `v ${height}`
        )
      }
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
      if (continuation === 'prev') {
        return (
          `M ${x + width},${y} ` +
          `v ${height - radius} ` +
          `a ${arcParams} ${-radius},${radius}` +
          `h ${-width + radius} ` +
          `v ${-height}`
        )
      }
      if (continuation === 'next') {
        return (
          `M ${x},${y + height} ` +
          `v ${-height} ` +
          `h ${width} ` +
          `v ${height - radius} ` +
          `a ${arcParams} ${-radius},${radius}`
        )
      }
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
