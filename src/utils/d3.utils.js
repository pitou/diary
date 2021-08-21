import * as d3 from 'd3'
import { random } from 'lodash-es'

import {
  BLOCK_WIDTH,
  HORIZONTAL_PADDING,
  PAGE_HEIGHT,
  PAGE_HEIGHT_PLUS_GAP,
  PAGE_WIDTH,
  PAGES_GAP,
  PAPER_PAGE_H,
  SVG_MARGIN_TOP,
  SVG_SCALE_DESKTOP,
  SVG_SCALE_MOBILE,
  SVG_SCALE_TABLET,
} from '../constants'
import { isMobile, isTablet } from './window.utils'

const getNewScale = () => {
  if (isMobile()) {
    return SVG_SCALE_MOBILE
  }
  if (isTablet()) {
    return SVG_SCALE_TABLET
  }
  return SVG_SCALE_DESKTOP
}

let currentScale = getNewScale()

window.addEventListener('resize', () => {
  const newScale = getNewScale()

  if (newScale !== currentScale) {
    currentScale = newScale
    d3.selectAll('#pages svg').attr('transform', `scale(${newScale})`)
  }
})

export const addSvg = () => {
  return d3
    .select('#pages')
    .append('div')
    .append('svg')
    .style('width', `${PAGE_WIDTH * 2 + PAGES_GAP + HORIZONTAL_PADDING * 2}px`)
    .style('height', `${PAGE_HEIGHT_PLUS_GAP + SVG_MARGIN_TOP}px`)
    .attr('transform', `scale(${currentScale})`)
}

export const addPage = (container, isLeftPage) => {
  const x = HORIZONTAL_PADDING + (isLeftPage ? 0 : PAGE_WIDTH + PAGES_GAP)
  const y = SVG_MARGIN_TOP

  return container
    .append('g')
    .attr('class', `page ${isLeftPage ? 'left' : 'right'}`)
    .attr('width', PAGE_WIDTH)
    .attr('height', PAGE_HEIGHT)
    .attr('transform', `translate(${x} ${y})`)
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
