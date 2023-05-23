/* global chrome */

const jobOfferRegex = /^https:\/\/www.infojobs.net\/.+\/.+\/of-.+/

if (jobOfferRegex.test(window.location.href)) {
  // La URL coincide con el patrón de una página de oferta de empleo

  // Enviar un mensaje al background script para recuperar el access token
  chrome.runtime.sendMessage({message: "getAccessToken"}, function(response) {
    const newElement = document.createElement('div')
    newElement.classList.add('container-expanded', 'panel-canvas', 'panel-rounded', 'inner-expanded', 'inner-s')
    
    // Mostrar contenido diferente dependiendo de si hay un access token o no
    if (response.status === 'invalid_token') {
      // Manejar el caso de un token no válido aquí
      newElement.textContent = 'Para poder utilizar Infojobs Assistant, debes iniciar sesión en Infojobs.'
    } else {
      newElement.textContent = 'Usuario logueado. Access token: ' + response.accessToken
      
      // Ahora buscar el id de la oferta
      let scriptElement = [...document.querySelectorAll("script")]
                .find(element => element.id === "tealium-data");

      let scriptContent = scriptElement.textContent || scriptElement.innerText;
      let match = scriptContent.match(/utag_data\.ad_id='(.*?)';/);
            
      if (match && match[1]) {
          const offerId = match[1];
          newElement.textContent += '. Offer id: ' + offerId;

          const button = document.createElement('button');
          button.textContent = "Consulta API";
          button.onclick = function() {
              chrome.runtime.sendMessage({message: "fetchApiData", accessToken: response.accessToken, offerId: offerId});
          };
          newElement.appendChild(button);
      } else {
          newElement.textContent += '. No se encontró id de oferta';
      }
    }

    // Localizar el elemento existente e insertar el nuevo elemento antes de él
    const existingElement = document.querySelector('.container-expanded.panel-default')
    existingElement.parentNode.insertBefore(newElement, existingElement)
  })
}
