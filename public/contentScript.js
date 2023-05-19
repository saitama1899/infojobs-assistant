/* global chrome */

const jobOfferRegex = /^https:\/\/www.infojobs.net\/.+\/.+\/of-.+/

if (jobOfferRegex.test(window.location.href)) {
  // La URL coincide con el patrón de una página de oferta de empleo

  // Enviar un mensaje al background script para recuperar el access token
  chrome.runtime.sendMessage({message: "getAccessToken"}, function(response) {
    const newElement = document.createElement('div')
    newElement.classList.add('container-expanded', 'panel-canvas', 'panel-rounded', 'inner-expanded', 'inner-s')
    
    // Mostrar contenido diferente dependiendo de si hay un access token o no
    if (response.accessToken) {
      newElement.textContent = 'Usuario logueado. Access token: ' + response.accessToken
    } else {
      newElement.textContent = 'Para poder utilizar Infojobs Assistant, debes iniciar sesión en Infojobs.'
    }

    // Localizar el elemento existente e insertar el nuevo elemento antes de él
    const existingElement = document.querySelector('.container-expanded.panel-default')
    existingElement.parentNode.insertBefore(newElement, existingElement)
  })
}
