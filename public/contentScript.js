/* global chrome */

const jobOfferRegex = /^https:\/\/www.infojobs.net\/.+\/.+\/of-.+/

if (jobOfferRegex.test(window.location.href)) {
  document.getElementById('howyoumatchcard').style.display = 'none'

  chrome.runtime.sendMessage({message: "getAccessToken"}, function(response) {
    const ijaAnalytics = document.createElement('section')
    ijaAnalytics.classList.add('container-expanded', 'panel-canvas', 'panel-rounded', 'inner-expanded', 'inner')
    const content = document.createElement('div')
    content.style.display = 'flex'
    content.style.alignItems = 'start'
    content.style.gap = '20px'
    ijaAnalytics.appendChild(content)

    const logo = document.createElement('img')
    logo.src = 'https://res.cloudinary.com/dykoj2iuj/image/upload/v1685080130/logo_xcc4nz.png'
    logo.style.width = '40px'
    content.appendChild(logo)

    if (response.status === 'invalid_token') {
      let title = document.createElement('h3')
      title.textContent = 'Para poder utilizar Infojobs Assistant, debes iniciar sesión en Infojobs'
      content.appendChild(title)
    } else {
      let scriptElement = [...document.querySelectorAll("script")]
        .find(element => element.id === "tealium-data")
      let scriptContent = scriptElement.textContent || scriptElement.innerText
      let match = scriptContent.match(/utag_data\.ad_id='(.*?)'/)
            
      if (match && match[1]) {
          const offerId = match[1]
          console.log('Offer id: ' + offerId)

          const rightColumn = document.createElement('div')
          rightColumn.style.flexGrow = '1'
          content.appendChild(rightColumn)
          const title = document.createElement('h3')
          title.textContent = 'Saca lo mejor de ti y consigue este empleo con la ayuda de Infojobs Assistant'
          rightColumn.appendChild(title)

          const subtitle = document.createElement('p')
          subtitle.textContent = 'Averigua cómo puedes enfocar tu currículum para destacar entre los demás candidatos, qué puedes esperar de este proceso de seleccion, tu nivel de compatibilidad y porcentaje de éxito.'
          rightColumn.appendChild(subtitle)

          const button = document.createElement('button')
          button.classList.add('ij-Link', 'sui-AtomButton', 'sui-AtomButton--primary', 'sui-AtomButton--outline', 'sui-AtomButton--center', 'sui-AtomButton--small', 'sui-AtomButton--link', 'no-printable')
          button.textContent = "Analizar esta oferta"
          rightColumn.appendChild(button)
          button.onclick = function() {
            // chrome.runtime.sendMessage({message: "fetchApiData", accessToken: response.accessToken, offerId: offerId})
            rightColumn.removeChild(button)
            subtitle.textContent = 'Por favor ten paciencia, este análisis puede tardar alrededor de 1 minuto.'
            const loading = document.createElement('div')
            loading.style.textAlign = 'center'
            const gif = document.createElement('img')
            gif.src = 'https://res.cloudinary.com/dykoj2iuj/image/upload/v1685091115/loading_ysz2da.gif'
            gif.style.width = '80px'
            loading.appendChild(gif)
            rightColumn.append(loading)
          }
          

      } else {
          console.error('No se encontró id de oferta')
      }
    }

    const existingElement = document.querySelector('.container-expanded.panel-default')
    existingElement.parentNode.insertBefore(ijaAnalytics, existingElement)
  })
}
