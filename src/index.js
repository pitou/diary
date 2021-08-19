import { parse } from 'papaparse'
import * as d3 from 'd3'
import { random } from 'lodash-es'

import { getRoundedRectPath } from './rect'

const PAPER_PAGE_W = 14
const PAPER_PAGE_H = 20.5

const PAGE_BORDER_MAX_RADIUS = 5

const pageWidth = 40
const pageHeight = (pageWidth * PAPER_PAGE_H) / PAPER_PAGE_W
const pageHeightPlusGap = pageHeight + 40

const pageScale = d3.scaleLinear().domain([0, PAPER_PAGE_H]).range([0, pageHeight])

const cols = 8

const svgWidth = 910

const GAP = 6

const drawPageBlock = (page, pageIndex, actualBlocksCount) => {
  return (height, blockY, blockIndex) => {
    const radius = height > 0 ? Math.min(height, PAGE_BORDER_MAX_RADIUS) : PAGE_BORDER_MAX_RADIUS
    const isLeftPage = pageIndex % 2 === 0

    page
      .append('path')
      .attr('class', height === 0 ? 'missingPages' : 'pageBlock')
      .attr('d', (/*d*/) => {
        let roundedCornersType
        if (actualBlocksCount === 1 && height > 0) {
          roundedCornersType = isLeftPage ? 'l' : 'r'
        } else if (blockIndex === 0) {
          roundedCornersType = isLeftPage ? 'tl' : 'tr'
        } else if (blockIndex === actualBlocksCount - 1 && height > 0) {
          roundedCornersType = isLeftPage ? 'bl' : 'br'
        }
        return getRoundedRectPath(roundedCornersType, 0, blockY, pageWidth, height || GAP, radius)
      })
  }
}

const drawLine = (page, y) => {
  const line = page.append('g').attr('transform', `translate(3, ${y})`)

  line
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', pageWidth - random(6, 16))
    .attr('y2', 0)
    .attr('stroke', '#595959')
    .attr('stroke-width', 0.5)
}

const drawLines = (page, height, blockY) => {
  const h = height / 2
  const t = h / 2
  let linesY = height >= 6 ? [h] : []
  if (t >= 4) {
    if (t - t / 2 < 4) {
      linesY = [t, h + t, h]
    } else {
      linesY = [t / 2, t, h - t / 2, h, h + t / 2, h + t, h + t + t / 2]
    }
  }

  linesY.forEach((y) => {
    drawLine(page, blockY + y)
  })
}

const drawPageNum = (page, i) => {
  page
    .append('text')
    .attr('x', i % 2 === 0 ? pageWidth - 13 + (i < 10 ? 5 : 0) : 2)
    .attr('y', pageHeight + 14)
    .attr('fill', '#565656')
    .attr('font-family', 'Helvetica')
    .attr('font-size', 7)
    .text(i + 1)
}

const showPages = (data) => {
  const dataSample = data.data.slice(1).map((dd) =>
    dd.slice(2).reduce((acc, val, dayIndex) => {
      if (val !== null) {
        acc.push({ val, dayIndex })
      }
      return acc
    }, [])
  )

  const svgHeight = (dataSample.length / cols) * pageHeightPlusGap * 2.05

  const svg = d3.select('#chart').append('svg').attr('width', svgWidth).attr('height', svgHeight)

  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 10)
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('fill', '#ffffff')

  const group = svg.append('g').attr('transform', `translate(50 50) scale(2)`)

  dataSample.forEach((blocks, pageIndex) => {
    // console.log(i, filteredD.join(', '))

    const blockX = (pageIndex % cols) * 50 + ((pageIndex % cols) % 2 === 0 ? 10 : GAP)
    let blockY = 0
    const yCoord = Math.floor(pageIndex / cols)
    // let globalBlockIndex = 0
    let actualBlockIndex = 0

    const page = group
      .append('g')
      .attr('transform', `translate(${blockX} ${pageHeightPlusGap * yCoord})`)

    const blocksUpdated = blocks.map((b) => ({
      ...b,
      height: b.val > 0 ? pageScale(b.val) - GAP / 2 : 0,
    }))
    const actualBlocksCount = blocksUpdated.filter((b) => b.height > 0).length

    const _drawPageBlock = drawPageBlock(page, pageIndex, actualBlocksCount)

    blocksUpdated.forEach(({ height, dayIndex }, blockIndex) => {
      blockY += blockIndex > 0 ? pageScale(blocks[blockIndex - 1].val) : GAP

      _drawPageBlock(height, blockY, actualBlockIndex)

      if (height > 0) {
        drawLines(page, height, blockY)
        // globalBlockIndex++
        actualBlockIndex++
      }
    })

    drawPageNum(page, pageIndex)
  })
}

export const processData = async () => {
  parse('http://localhost:8000/public/data.csv', {
    // header: true,
    download: true,
    dynamicTyping: true,
    delimiter: ',',
    complete: showPages,
  })
}
