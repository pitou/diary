import { isMobile } from './utils/window.utils'

const showPopup = (popup) => (block) => {
  const isLeftPage = block.closest('.page').classList.contains('left')

  popup.querySelector('#dates').innerHTML = block.getAttribute('data-dates')
  if (!isMobile()) {
    popup.querySelector('#continuation').innerHTML = block.getAttribute('data-continuation')
  }
  popup.style.display = 'block'

  const { width: popupWidth } = popup.getBoundingClientRect()
  const { top, left, right, height } = block.getBoundingClientRect()

  if (isLeftPage) {
    popup.classList.remove('right')
    popup.classList.add('left')
  } else {
    popup.classList.remove('left')
    popup.classList.add('right')
  }
  popup.style.top = `${window.scrollY + top + height / 2 - 18}px`
  popup.style.left = `${isLeftPage ? right + 12 : left - popupWidth - 12}px`
}

const interval = setInterval(() => {
  const blocks = document.querySelectorAll('.pageBlock')
  const popup = document.querySelector('#popup')
  if (blocks.length === 0 || !popup) {
    return
  }
  clearInterval(interval)

  const _showPopup = showPopup(popup)

  blocks.forEach((block) => {
    block.addEventListener('mouseover', (e) => {
      if (!isMobile()) _showPopup(e.target)
    })

    block.addEventListener('click', (e) => {
      if (isMobile()) _showPopup(e.target)
    })

    block.closest('.page').addEventListener('mouseout', () => {
      popup.style.display = 'none'
    })
  })
}, 100)
