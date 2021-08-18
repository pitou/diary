import { parse } from 'papaparse'
import * as d3 from 'd3'
import { random } from 'lodash-es'

const PAPER_PAGE_W = 14
const PAPER_PAGE_H = 20.5

const pageWidth = 40
const pageHeight = (pageWidth * PAPER_PAGE_H) / PAPER_PAGE_W
const pageHeightPlusGap = pageHeight + 40

const pageScale = d3.scaleLinear().domain([0, PAPER_PAGE_H]).range([0, pageHeight])

const rows = 16
const cols = 10

const svgWidth = cols * 70
const svgHeight = rows * pageHeightPlusGap + 100

const GAP = 6

const drawPageBlock = (page, y, height) => {
  page
    .append('rect')
    .attr('x', 0)
    .attr('y', y)
    .attr('width', pageWidth)
    .attr('height', height || GAP)
    .attr('stroke', height > 0 ? '#b4b4b4' : 'transparent')
    .attr('fill', height > 0 ? 'transparent' : '#ff3300')
    .attr('opacity', height > 0 ? 1 : 0.1)
}

const drawLine = (page, y, blockIndex) => {
  const line = page.append('g').attr('transform', `translate(3, ${y})`)

  line
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', pageWidth - random(6, 16))
    .attr('y2', 0)
    .attr('stroke', blockIndex % 2 === 0 ? '#595959' : '#595959')
    .attr('stroke-width', 0.5)
}

const drawLines = (page, height, blockY, blockIndex) => {
  const h = height / 2
  const t = h / 2
  const linesY = t - t / 2 < 4 ? [t, h + t] : [t / 2, t, h - t / 2, h + t / 2, h + t, h + t + t / 2]

  drawLine(page, blockY + h, blockIndex)

  if (t >= 3) {
    linesY.forEach((y) => {
      drawLine(page, blockY + y, blockIndex)
    })
  }
}

const drawPageNum = (page, i) => {
  page
    .append('text')
    .attr('x', i % 2 === 0 ? pageWidth - 13 + (i < 10 ? 5 : 0) : 2)
    .attr('y', pageHeight + 16)
    .attr('fill', '#565656')
    .attr('font-family', 'Helvetica')
    .attr('font-size', 10)
    .text(i + 1)
}

const showPages = (data) => {
  const dataSample = data.data.slice(1).map((d) => d.slice(2)) //.slice(0, 11)

  const svg = d3.select('#chart').append('svg').attr('width', svgWidth).attr('height', svgHeight)

  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 10)
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('fill', '#ffffff')

  const group = svg.append('g').attr('transform', `translate(50 50)`)

  dataSample.forEach((dd, i) => {
    const filteredD = dd.filter((d) => d !== null)
    // console.log(i, filteredD.join(', '))

    const blockX = (i % cols) * 50 + ((i % cols) % 2 === 0 ? 10 : GAP)
    let blockY = 0
    const yCoord = Math.floor(i / cols)
    let blockIndex = 0

    const page = group
      .append('g')
      .attr('transform', `translate(${blockX} ${pageHeightPlusGap * yCoord})`)

    filteredD.forEach((d, j) => {
      const height = d > 0 ? pageScale(d) - GAP / 2 : 0
      blockY += j > 0 ? pageScale(filteredD[j - 1]) : GAP

      drawPageBlock(page, blockY, height)

      if (height > 0) {
        blockIndex++
        drawLines(page, height, blockY, blockIndex)
      }
    })

    drawPageNum(page, i)
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
