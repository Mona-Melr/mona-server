const buildBullet = index => {
  const classes = ['bullet', 'bullet-fill', 'bullet-check']
  const [bullet, fill, check] = classes.map(value => {
    const element = document.createElement('div')

    element.setAttribute('class', value)

    return element
  })

  if (index === 0) gsap.set(fill, { width: '100%' })

  { [fill, check].forEach(element => bullet.appendChild(element)) }

  const bulletWrapper = document.querySelector('.slide-bullet-wrapper')
  bulletWrapper.appendChild(bullet)
}

const { gsap } = window

const setupItem = (item, index) => {
  gsap.set(item, { xPercent: 100 })
  Object.assign(item.style, { display: 'flex' })

  if (index === 0) gsap.to(item, 0.8, { xPercent: 0 })
}

const bulletBack = index => {
  const fill = `.bullet:nth-child(${index + 1}) .bullet-fill`
  gsap.set(fill, { width: '0%' })

  const previousBullet = `.bullet:nth-child(${index})`
  gsap.to(previousBullet, { background: 'rgba(0,0,0,0.5)' })

  const previousCheck = `${previousBullet} .bullet-check`
  const onComplete = () => gsap.set(previousCheck, { width: '0%' })

  const previousFill = `${previousBullet} .bullet-fill`
  gsap.to(previousFill, 0.6, { width: '100%', onComplete })
}

const bulletNext = index => {
  const bullet = `.bullet:nth-child(${index + 1})`
  const check = `${bullet} .bullet-check`

  gsap.set(check, { width: '100%' })
  gsap.set(bullet, { background: 'transparent' })

  const nextFill = `.bullet:nth-child(${index + 2}) .bullet-fill`
  const onComplete = () => gsap.set(nextFill, { width: '100%' })

  const fill = `${bullet} .bullet-fill`
  gsap.fromTo(fill, 0.6, { width: '100%' }, { width: '0%', onComplete })
}

const slideBack = (item, index) => {
  gsap.to(item, 0.8, { xPercent: 100 })

  const previousItem = `.slider-item:nth-child(${index})`
  gsap.to(previousItem, 0.8, { xPercent: 0 })
}

const slideNext = (item, index) => {
  gsap.to(item, 0.8, { xPercent: -100 })

  const nextItem = `.slider-item:nth-child(${index + 2})`
  gsap.to(nextItem, 0.8, { xPercent: 0 })
}

const updateCollectJS = (order, person, price) => {
  const { CollectJS } = window

  CollectJS.configure({
    price,
    fields: {
      applePay: {
        totalLabel: `Custom Payment for Order/PO: ${order}`
      }
    },
    callback: ({ token, tokenType }) => {
      const inputAttributes = [
        ['merchant_defined_field_1', order], ['amount', price],
        ['tokenType', tokenType], ['merchant_defined_field_2', person],
        ['payment_token', token]
      ]
      const form = document.getElementById('finalForm')

      inputAttributes.forEach(([name, value]) => {
        const element = document.createElement('input')
        const input = Object.assign(element, { name, value })

        form.appendChild(input)
      })

      form.submit()
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form')
    .forEach(form => form.addEventListener('submit', e => e.preventDefault()))

  const items = document.querySelectorAll('.slider-item')
  items.forEach((item, index, items) => {
    buildBullet(index)
    setupItem(item, index)

    const back = item.querySelector('button.back')
    if (back) back.addEventListener('click', () => {
      bulletBack(index)
      slideBack(item, index)
    })

    const next = item.querySelector('button.next')
    if (next) next.addEventListener('click', () => {
      const areFilled = [...item.querySelectorAll('[required]')]
        .map(({ value }) => value)
        .every(Boolean)

      if (areFilled) {
        const nextIsLast = index === items.length - 2
        if (nextIsLast) {
          const allRequired = document.querySelectorAll('[required]')
          const allValues = [...allRequired].map(({ value }) => value)

          updateCollectJS(...allValues)
        }

        bulletNext(index)
        slideNext(item, index)
      }
    })
  })
})
