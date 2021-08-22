import { parse } from 'papaparse'
import { range, chunk } from 'lodash-es'
import dayjs from 'dayjs'

import { getRoundedRectPath, getContinuationLine, getContinuation } from './utils/pages.utils'
import {
  PAGE_PADDING_TOP,
  PAGE_BORDER_MAX_RADIUS,
  BLOCKS_GAP,
  MISSING_PAGES_BLOCK_HEIGHT,
} from './constants'
import {
  addPage,
  addSvg,
  drawLine,
  writeMonth,
  writePageNum,
  getPageScale,
  drawContinuationLine,
} from './utils/d3.utils'
import { formatDatesForPopup } from './utils/dates.utils'
import { getPagesData } from './utils/data.utils'

const drawPageBlock = (page, isLeftPage, actualBlocksCount) => {
  return (blockHeight, blockY, actualBlockIndex, dates, continuation) => {
    const blockX = 0
    const radius =
      blockHeight > 0 ? Math.min(blockHeight, PAGE_BORDER_MAX_RADIUS) : PAGE_BORDER_MAX_RADIUS

    let roundedCornersType
    if (actualBlocksCount === 1 && blockHeight > 0) {
      roundedCornersType = isLeftPage ? 'l' : 'r'
    } else if (actualBlockIndex === 0) {
      roundedCornersType = isLeftPage ? 'tl' : 'tr'
    } else if (actualBlockIndex === actualBlocksCount - 1 && blockHeight > 0) {
      roundedCornersType = isLeftPage ? 'bl' : 'br'
    }

    const rectPath = getRoundedRectPath(
      roundedCornersType,
      blockX,
      blockY,
      blockHeight || MISSING_PAGES_BLOCK_HEIGHT,
      radius
    )

    // Update page class
    if (actualBlockIndex === 0 && ['prev', 'both'].includes(continuation)) {
      page.classed('withPrevContinuation', true)
    }

    // Append block
    const block = page.append('path').attr('d', rectPath)

    const isMissingDays = blockHeight === 0
    if (isMissingDays) {
      block.attr('class', `missingDays ${actualBlockIndex === 0 ? `missingDays-0` : ''}`)
    } else {
      block.attr('class', 'pageBlock').attr('data-dates', formatDatesForPopup(dates)).attr(
        'data-continuation',
        {
          prev: 'Continues from previous page.',
          next: 'Continues on next page.',
          both: 'Continues from/on adjacent pages.',
        }[continuation]
      )
    }

    if (continuation) {
      drawContinuationLine(
        page,
        getContinuationLine(continuation, {
          roundedCornersType,
          blockX,
          blockY,
          blockHeight,
          radius,
        })
      )
    }
  }
}

const drawLines = (page, height, blockY) => {
  const h = height / 2
  const t = h / 2
  let linesY = height >= 6 ? [h] : []
  if (t >= 4) {
    // Upper limits of range are increased by 1 step unit because they're excluded from the array
    if (t - t / 2 < 4) {
      linesY = range(t, h + t + t, t)
    } else {
      linesY = range(t / 2, h + t + t / 2 + t / 2, t / 2)
    }
  }

  linesY.forEach((y) => {
    drawLine(page, blockY + y)
  })
}

const maybeWriteMonth = (page, blocks, prevMonth, isLeftPage) => {
  const date = new Date(blocks[blocks.length - 1].date)
  const month = dayjs(date).format('MMM')

  if (month !== prevMonth) {
    const year = dayjs(date).format('YYYY')
    writeMonth(page, month, year, isLeftPage)
  }
  return month
}

const showPages = ({ data }) => {
  const pagesData = getPagesData(data)

  const pageScale = getPageScale()

  let prevMonth = ''

  const drawPage = (div, blocks, pageIndex) => {
    const isLeftPage = pageIndex % 2 === 0

    let blockY = PAGE_PADDING_TOP
    let actualBlockIndex = 0 // index for blocks with val > 0
    let blockFirstEmptyDate = ''

    const page = addPage(div, isLeftPage)

    const actualBlocksCount = blocks.filter((b) => b.val > 0).length // remove empty days
    const _drawPageBlock = drawPageBlock(page, isLeftPage, actualBlocksCount)

    const _getContinuation = getContinuation(pagesData, pageIndex)

    blocks.forEach(({ val, date }) => {
      const height = val > 0 ? pageScale(val) - BLOCKS_GAP : 0

      drawLines(page, height, blockY)

      // mouseover event works better if the container is added after the lines
      const dates = blockFirstEmptyDate ? [blockFirstEmptyDate, date] : [date]

      const continuation = val > 0 ? _getContinuation(blockFirstEmptyDate || date) : null
      _drawPageBlock(height, blockY, actualBlockIndex, dates, continuation)

      blockY += pageScale(val)

      if (height > 0) {
        actualBlockIndex++
        blockFirstEmptyDate = ''
      } else if (!blockFirstEmptyDate) {
        blockFirstEmptyDate = date
      }
    })

    prevMonth = maybeWriteMonth(page, blocks, prevMonth, isLeftPage)

    writePageNum(page, pageIndex + 1)
  }

  // Create one SVG for each couple of pages
  chunk(Object.values(pagesData), 2).forEach((chunk, i) => {
    const svg = addSvg()

    chunk.forEach((blocks, j) => {
      drawPage(svg, blocks, i * 2 + j)
    })
  })
}

export const processData = async () => {
  parse('/public/diary/data.csv', {
    header: true,
    download: true,
    dynamicTyping: true,
    delimiter: ',',
    complete: showPages,
  })
}
