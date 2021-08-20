const interval = setInterval(() => {
  const blocks = document.querySelectorAll('.pageBlock')
  const popup = document.querySelector('#popup')
  if (blocks.length === 0 || !popup) {
    return
  }
  clearInterval(interval)

  blocks.forEach((block) => {
    block.addEventListener('mouseover', (e) => {
      // Temporarily disable on mobile
      if (window.innerWidth <= 700) {
        return
      }

      const block = e.target

      const { right, top, height } = block.getBoundingClientRect()
      popup.style.left = `${right + 12}px`
      popup.style.top = `${window.scrollY + top + height / 2 - 18}px`
      popup.style.display = 'block'

      popup.querySelector('#dates').innerHTML = block.getAttribute('data-dates')
      popup.querySelector('#continuation').innerHTML = block.getAttribute('data-continuation')
    })

    block.addEventListener('mouseout', () => {
      popup.style.display = 'none'
    })
  })
}, 100)
