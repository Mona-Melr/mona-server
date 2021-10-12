
document.addEventListener('DOMContentLoaded', () => {
  window.CollectJS.configure({
    validationCallback: (field, status, message) => {
      const type = t => `${field} is now ${t}: ${message}`
      console.log(status ? type('OK') : type('Invalid'))
    }
  })
})
