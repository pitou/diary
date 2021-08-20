import { parse } from 'papaparse'
import * as d3 from 'd3'
import { random, range } from 'lodash-es'
import dayjs from 'dayjs'

import { getRoundedRectPath, getContinuationLine } from './pages.utils'

const PAPER_PAGE_W = 14
const PAPER_PAGE_H = 20.5

const PAGE_BORDER_MAX_RADIUS = 5

const pageWidth = 40
const pageHeight = (pageWidth * PAPER_PAGE_H) / PAPER_PAGE_W
const pageHeightPlusGap = pageHeight + 40

const pageScale = d3.scaleLinear().domain([0, PAPER_PAGE_H]).range([0, pageHeight])

const blockWidth = pageWidth

const cols = 8

const svgWidth = 910

const GAP = 6

const formatDatesForPopup = (dates) => {
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

const drawPageBlock = (page, isLeftPage, actualBlocksCount) => {
  return (blockHeight, blockY, blockIndex, dates, continuation) => {
    const radius =
      blockHeight > 0 ? Math.min(blockHeight, PAGE_BORDER_MAX_RADIUS) : PAGE_BORDER_MAX_RADIUS

    let roundedCornersType
    if (actualBlocksCount === 1 && blockHeight > 0) {
      roundedCornersType = isLeftPage ? 'l' : 'r'
    } else if (blockIndex === 0) {
      roundedCornersType = isLeftPage ? 'tl' : 'tr'
    } else if (blockIndex === actualBlocksCount - 1 && blockHeight > 0) {
      roundedCornersType = isLeftPage ? 'bl' : 'br'
    }

    const blockX = 0

    page
      .append('path')
      .attr('class', blockHeight === 0 ? 'missingPages' : 'pageBlock')
      .attr('data-dates', formatDatesForPopup(dates))
      .attr(
        'data-continuation',
        {
          prev: 'Continues from previous page.',
          next: 'Continues on next page.',
          both: 'Continues from/on adjacent pages.',
        }[continuation]
      )
      .attr(
        'd',
        getRoundedRectPath(
          roundedCornersType,
          blockX,
          blockY,
          blockWidth,
          blockHeight || GAP,
          radius
        )
      )

    if (continuation) {
      const d = getContinuationLine(continuation, {
        roundedCornersType,
        blockX,
        blockY,
        blockWidth,
        blockHeight,
        radius,
      })
      page
        .append('path')
        .attr('d', d)
        .attr('stroke', '#ffffff')
        .attr('opacity', '1')
        .attr('stroke-width', 1.5) // bigger than normal lines, to cover them completely
        .attr('stroke-dasharray', '0 3 3')
    }
  }
}

const drawLine = (page, y) => {
  const line = page.append('g').attr('transform', `translate(3, ${y})`)

  line
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', blockWidth - random(6, 16))
    .attr('y2', 0)
    .attr('stroke', '#595959')
    .attr('stroke-width', 0.5)
}

const drawLines = (page, height, blockY) => {
  const h = height / 2
  const t = h / 2
  let linesY = height >= 6 ? [h] : []
  if (t >= 4) {
    // Upper limits of range are increased by 1 step unit because they're exluded from the array
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

const writeMonth = (page, date, year, isLeftPage) => {
  page
    .append('text')
    .attr('x', isLeftPage ? 4 : 1)
    .attr('y', 0)
    .attr('fill', '#565656')
    .attr('font-family', 'Helvetica')
    .attr('font-size', 6)
    .attr('font-weight', 'bold')
    .text(`${date} ${year}`)
}

const maybeWriteMonth = (page, blocks, prevMonth, isLeftPage) => {
  const date = new Date(blocks[0].date)
  const month = dayjs(date).format('MMM')

  if (month !== prevMonth) {
    const year = dayjs(date).format('YYYY')
    writeMonth(page, month, year, isLeftPage)
  }
  return month
}

const writePageNum = (page, pageNum) => {
  page
    .append('text')
    .attr('x', pageNum % 2 === 1 ? pageWidth - 9 + (pageNum < 10 ? 3 : 0) : 2)
    .attr('y', pageHeight + 12)
    .attr('fill', '#565656')
    .attr('font-family', 'Helvetica')
    .attr('font-size', 6)
    .text(pageNum)
}

const getContinuation = (prevPageLastDate, nextPageFirstDate) => (date) => {
  if (date === prevPageLastDate) {
    return date === nextPageFirstDate ? 'both' : 'prev'
  }
  return date === nextPageFirstDate ? 'next' : ''
}

const getAdjacentPagesDates = (pagesData, pageIndex) => {
  const prevPage = pagesData[pageIndex - 1]
  const prevPageLastBlock = prevPage && prevPage[prevPage.length - 1]
  const { date: prevPageLastDate } = prevPageLastBlock || {}

  const nextPage = pagesData[pageIndex + 1]
  const nextPageFirstBlock = nextPage && nextPage[0]
  const { date: nextPageFirstDate } = nextPageFirstBlock || {}

  return { prevPageLastDate, nextPageFirstDate }
}

const showPages = ({ data }) => {
  const pagesData = Object.values(data).reduce((acc, dd, dayIndex) => {
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

  const svgHeight = (Object.values(pagesData).length / cols) * pageHeightPlusGap * 2.05

  const svg = d3.select('#chart').append('svg').attr('width', svgWidth).attr('height', svgHeight)

  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 10)
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('fill', '#ffffff')

  const group = svg.append('g').attr('transform', `translate(50 50) scale(2)`)

  let prevMonth = ''

  Object.values(pagesData).forEach((blocks, pageIndex) => {
    const isLeftPage = pageIndex % 2 === 0

    const blockX = (pageIndex % cols) * 50 + ((pageIndex % cols) % 2 === 0 ? 10 : GAP)
    let blockY = 0
    let actualBlockIndex = 0 // index for blocks with val > 0
    let blockFirstEmptyDate = ''

    const page = group
      .append('g')
      .attr('transform', `translate(${blockX} ${pageHeightPlusGap * Math.floor(pageIndex / cols)})`)

    const blocksUpdated = blocks.map((b) => ({
      ...b,
      height: b.val > 0 ? pageScale(b.val) - GAP / 2 : 0,
    }))
    const actualBlocks = blocksUpdated.filter((b) => b.height > 0)

    const { prevPageLastDate, nextPageFirstDate } = getAdjacentPagesDates(pagesData, pageIndex)

    const _drawPageBlock = drawPageBlock(page, isLeftPage, actualBlocks.length)
    const _getContinuation = getContinuation(prevPageLastDate, nextPageFirstDate)

    blocksUpdated.forEach(({ height, date }, blockIndex) => {
      const { val: prevVal } = blockIndex > 0 ? blocksUpdated[blockIndex - 1] : {}
      blockY += blockIndex > 0 ? pageScale(prevVal) : GAP

      drawLines(page, height, blockY)

      // mouseover event works better if the container is added after the lines
      const continuation = _getContinuation(date)
      const dates = blockFirstEmptyDate ? [blockFirstEmptyDate, date] : [date]
      _drawPageBlock(height, blockY, actualBlockIndex, dates, continuation)

      if (height > 0) {
        actualBlockIndex++
        blockFirstEmptyDate = ''
      } else if (!blockFirstEmptyDate) {
        blockFirstEmptyDate = date
      }
    })

    prevMonth = maybeWriteMonth(page, blocks, prevMonth, isLeftPage)

    writePageNum(page, pageIndex + 1)
  })
}

export const processData = async () => {
  parse('http://localhost:8000/public/data.csv', {
    header: true,
    download: true,
    dynamicTyping: true,
    delimiter: ',',
    complete: showPages,
  })
}
