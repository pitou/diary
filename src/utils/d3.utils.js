import * as d3 from 'd3'
import { random } from 'lodash-es'

import {
  BLOCK_WIDTH,
  COLS,
  PAGE_HEIGHT,
  PAGE_HEIGHT_PLUS_GAP,
  PAGE_WIDTH,
  PAPER_PAGE_H,
  SVG_WIDTH,
} from '../constants'

export const addSvg = (pagesData) => {
  const svgHeight = (Object.values(pagesData).length / COLS) * PAGE_HEIGHT_PLUS_GAP * 2.05

  const svg = d3.select('#chart').append('svg').attr('width', SVG_WIDTH).attr('height', svgHeight)

  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 10)
    .attr('width', SVG_WIDTH)
    .attr('height', svgHeight)
    .attr('fill', '#ffffff')

  return svg
}

export const addContainer = (svg) => {
  return svg.append('g').attr('transform', `translate(50 80) scale(2)`)
}

export const addPage = (container, blockX, pageIndex) => {
  return container
    .append('g')
    .attr(
      'transform',
      `translate(${blockX} ${PAGE_HEIGHT_PLUS_GAP * Math.floor(pageIndex / COLS)})`
    )
}

export const getPageScale = () => {
  return d3.scaleLinear().domain([0, PAPER_PAGE_H]).range([0, PAGE_HEIGHT])
}

export const drawLine = (page, y) => {
  const line = page.append('g').attr('transform', `translate(3, ${y})`)

  line
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', BLOCK_WIDTH - random(6, 16))
    .attr('y2', 0)
    .attr('stroke', '#595959')
    .attr('stroke-width', 0.5)
}

export const writeMonth = (page, date, year, isLeftPage) => {
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

export const writePageNum = (page, pageNum) => {
  page
    .append('text')
    .attr('x', pageNum % 2 === 1 ? PAGE_WIDTH - 9 + (pageNum < 10 ? 3 : 0) : 2)
    .attr('y', PAGE_HEIGHT + 12)
    .attr('fill', '#565656')
    .attr('font-family', 'Helvetica')
    .attr('font-size', 6)
    .text(pageNum)
}

export const drawContinuationLine = (page, d) => {
  page
    .append('path')
    .attr('d', d)
    .attr('stroke', '#ffffff')
    .attr('opacity', '1')
    .attr('stroke-width', 1.5) // bigger than normal lines, to cover them completely
    .attr('stroke-dasharray', '0 3 3')
}
