if (!window.ApplePaySession) Object.assign(
  document.querySelector('input#pmap'),
  { disabled: true }
)

const { gsap } = window

// const buildBullet = () => {
//   const classes = ['bullet', 'bullet-fill', 'bullet-check']
//   const [bullet, fill, check] = classes.map(value => {
//     const element = document.createElement('div')

//     element.setAttribute('class', value)

//     return element
//   })

//   { [fill, check].forEach(element => bullet.appendChild(element)) }

//   return bullet
// }

// const appendBullet = bullet => document
//   .querySelector('.slide-bullet-wrapper')
//   .appendChild(bullet)

// const fillBullet = fill => gsap.set(fill, { width: '100%' })

// { [buildBullet(), buildBullet(), buildBullet()].forEach(appendBullet) }

// fillBullet(document.querySelector('div.slide-bullet-wrapper .bullet-fill'))

const initItem = item => gsap.set(item, { xPercent: 100 })
const resetItem = item => gsap.to(item, 0.8, { xPercent: 100 })
const displayFlex = item => Object.assign(item.style, { display: 'flex' })
const showItem = item => gsap.to(item, 0.8, { xPercent: 0 })
const hideItem = item => gsap.to(item, 0.8, { xPercent: -100 })

const updateCollectJS = formData => window.CollectJS.configure({

  price: formData[2].value,

  fields: {
    applePay: {
      totalLabel: `Custom Payment for Order/PO: ${formData[0].value}`
    }
  },

  callback: ({ token, tokenType }) => {
    const form = document.getElementById('formSubmit')

    { [
      ...formData,
      { name: 'payment_token', value: token },
      { name: 'tokenType', value: tokenType }
    ].forEach(inputValues => {
      form.appendChild(Object.assign(
        document.createElement('input'),
        inputValues
      ))
    }) }

    form.submit()
  }
})

const pay = (gpSlide, orderInfo) => {
  gpSlide.querySelector('button.back')
    .addEventListener('click', () => {
      resetItem(gpSlide)
      showItem(orderInfo)
    })
  const data = [...orderInfo.querySelectorAll('input:required')]

  updateCollectJS(data.map(({ name, value }) => ({ name, value })))
  showItem(gpSlide)
}

const setPaymentMethod = (method, orderInfo) => method
  .querySelector('button.next')
  .addEventListener('click', () => {
    hideItem(method)
    showItem(orderInfo)
  })

// const bulletBack = index => {
//   const fill = `.bullet:nth-child(${index + 1}) .bullet-fill`
//   gsap.set(fill, { width: '0%' })

//   const previousBullet = `.bullet:nth-child(${index})`
//   gsap.to(previousBullet, { background: 'rgba(0,0,0,0.5)' })

//   const previousCheck = `${previousBullet} .bullet-check`
//   const onComplete = () => gsap.set(previousCheck, { width: '0%' })

//   const previousFill = `${previousBullet} .bullet-fill`
//   gsap.to(previousFill, 0.6, { width: '100%', onComplete })
// }

// const bulletNext = index => {
//   const bullet = `.bullet:nth-child(${index + 1})`
//   const check = `${bullet} .bullet-check`

//   gsap.set(check, { width: '100%' })
//   gsap.set(bullet, { background: 'transparent' })

//   const nextFill = `.bullet:nth-child(${index + 2}) .bullet-fill`
//   const onComplete = () => gsap.set(nextFill, { width: '100%' })

//   const fill = `${bullet} .bullet-fill`
//   gsap.fromTo(fill, 0.6, { width: '100%' }, { width: '0%', onComplete })
// }

document.addEventListener('DOMContentLoaded', () => {
  const sliderItems = document.querySelectorAll('.slider-item')
  sliderItems.forEach(item => {
    initItem(item)
    displayFlex(item)
  })

  const [method] = sliderItems
  showItem(method)

  const orderInfo = document.getElementById('orderInfo')
  setPaymentMethod(method, orderInfo)

  orderInfo.querySelector('button.back').addEventListener('click', () => {
    resetItem(orderInfo)
    showItem(method)
  })

  orderInfo.querySelector('button.next').addEventListener('click', e => {
    const isValidOrder = [...orderInfo.querySelectorAll('input:required')]
      .every(e => e.reportValidity())

    if (isValidOrder) {
      hideItem(orderInfo)
      const { value } = method.querySelector('input:checked')
      const nextSlide = document.querySelector(`#${value}-pay`)
      pay(nextSlide, orderInfo)
    }
  })
})
