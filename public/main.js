if (!window.ApplePaySession) Object.assign(
  document.querySelector('input#pmap'),
  { disabled: true }
)

const { gsap } = window

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

      if (value !== 'cc') {
        const { CollectJS } = window
        CollectJS.configure({ tokenizationKey: '3Qhbhm-EZ29bz-z5b3yJ-AeTMYg' })
      }

      const nextSlide = document.querySelector(`#${value}-pay`)
      pay(nextSlide, orderInfo)
    }
  })
})
