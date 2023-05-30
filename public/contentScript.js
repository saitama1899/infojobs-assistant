/* global chrome */


const jobOfferRegex = /^https:\/\/www.infojobs.net\/.+\/.+\/of-.+/
const rightColumn = document.createElement('div')
const loading = renderLoading()
const subtitle = document.createElement('p')

if (jobOfferRegex.test(window.location.href)) {
  document.getElementById('howyoumatchcard').style.display = 'none'
  let scriptElement = [...document.querySelectorAll("script")]
    .find(element => element.id === "tealium-data")
  let scriptContent = scriptElement.textContent || scriptElement.innerText
  let match = scriptContent.match(/utag_data\.ad_id='(.*?)'/)
  let offerId = null
  if (match && match[1]) {
    offerId = match[1]
    console.log('Offer ID:', offerId)
  }
  renderSalary(scriptContent)
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
    rightColumn.style.flexGrow = '1'
    content.appendChild(rightColumn)
    const title = document.createElement('h3')
    title.textContent = 'Saca lo mejor de ti y consigue este empleo con la ayuda de Infojobs Assistant'
    rightColumn.appendChild(title)

    chrome.runtime.sendMessage({message: "getAnalytics", offerId: offerId}, function(result) {
      console.log('Analytics:', result);
      if (result.analytics) {
        rightColumn.appendChild(renderAnalytics(result.analytics))
        console.log('Datos listos para mostrarse')
      } else {
        if (response.status === 'invalid_token') {
          content.removeChild(title)
          let title = document.createElement('h3')
          title.textContent = 'Para poder utilizar Infojobs Assistant, debes iniciar sesión en Infojobs'
          content.appendChild(title)
        } else {   
          if (offerId) {
              subtitle.textContent = 'Averigua cómo puedes enfocar tu currículum para destacar entre los demás candidatos, qué puedes esperar de este proceso de seleccion, tu nivel de compatibilidad y porcentaje de éxito.'
              rightColumn.appendChild(subtitle)
    
              const button = document.createElement('button')
              button.classList.add('ij-Link', 'sui-AtomButton', 'sui-AtomButton--primary', 'sui-AtomButton--outline', 'sui-AtomButton--center', 'sui-AtomButton--small', 'sui-AtomButton--link', 'no-printable')
              button.textContent = "Analizar esta oferta"
              rightColumn.appendChild(button)
                
              button.onclick = function() {
                chrome.runtime.sendMessage({message: "fetchApiData", accessToken: response.accessToken, offerId: offerId})
                rightColumn.removeChild(button)
                subtitle.textContent = 'Por favor ten paciencia, este análisis puede tomar alrededor de 1 minuto.'
                rightColumn.append(loading)
              }
      
          } else {
            console.error('No se encontró id de oferta')
          }
        }
      }
    })
    const existingElement = document.querySelector('.container-expanded.panel-default')
    existingElement.parentNode.insertBefore(ijaAnalytics, existingElement)
  })
}

function renderAnalytics(analytics) {
  const analyticsContainer = document.createElement('div')
  
  const errores = renderAnalyticsElement(analytics[0], 'Posibles mejoras para tu CV')
  const adaptar = renderAnalyticsElement(analytics[1], 'Cómo adaptar tu CV a esta oferta')
  const proceso = renderAnalyticsElement(analytics[2], 'Qué esperar del proceso de selección')
  const compatibilidad = renderAnalyticsElement(analytics[3], 'Porcentaje de compatibilidad: ', analytics[3]?.percentage)
  const exito = renderAnalyticsElement(analytics[4], 'Porcentaje de éxito: ', analytics[4]?.percentage)

  analyticsContainer.appendChild(errores)
  analyticsContainer.appendChild(adaptar)
  analyticsContainer.appendChild(proceso)
  analyticsContainer.appendChild(compatibilidad)
  analyticsContainer.appendChild(exito)

  return analyticsContainer
}

function renderAnalyticsElement(element, title, percentage) {
  const elementContainer = document.createElement('div')
  const elementTitle = document.createElement('h4')
  elementTitle.classList.add('tag')
  elementTitle.style.width = 'fit-content'
  elementTitle.style.maxWidth = '100%'
  elementTitle.style.marginBottom = '15px'
  elementTitle.style.marginTop = '5px' 
  const elementContent = document.createElement('p')
  elementContent.style.marginBottom = '30px'
  elementTitle.textContent = title
  elementContent.textContent = element.text
  elementContainer.appendChild(elementTitle)
  elementContainer.appendChild(elementContent)
  
  if (percentage) {
    const elementPercentage = document.createElement('span')
    elementPercentage.style.fontWeight = 'bold'
    elementPercentage.textContent = percentage
    elementTitle.appendChild(elementPercentage)
  }

  return elementContainer
}

function renderLoading () {
  const loading = document.createElement('div')
  loading.style.textAlign = 'center'
  const gif = document.createElement('img')
  gif.src = 'https://res.cloudinary.com/dykoj2iuj/image/upload/v1685091115/loading_ysz2da.gif'
  gif.style.width = '80px'
  loading.appendChild(gif)
  return loading
}

chrome.runtime.onMessage.addListener(function(request) {
  if (request.message === 'apiDataStored') {
    rightColumn.removeChild(loading)
    rightColumn.removeChild(subtitle)
    rightColumn.appendChild(renderAnalytics(request.analytics))
  }
})

function getSalaryByCategory(category) {
  // Datos sacados de talent.com
  const salaries = {
    "administracion-de-empresas": 29500,
    "administracion-publica": 25500,
    "atencion-a-clientes": 17000,
    "calidad-produccion-e-i-d": 22500,
    "comercial-y-ventas": 22500,
    "compras-logistica-y-almacen": 18500,
    "diseno-y-artes-graficas": 20500,
    "educacion-y-formacion": 23000,
    "finanzas-y-banca": 26000,
    "informatica-y-telecomunicaciones": 26500,
    "ingenieros-y-tecnicos": 30000,
    "inmobiliario-y-construccion": 23500,
    "legal": 23000,
    "marketing-y-comunicacion": 27000,
    "profesiones-artes-y-oficios": 18.500,
    "recursos-humanos": 22000,
    "sanidad-y-salud": 32000,
    "sector-farmaceutico": 21500,
    "turismo-y-restauracion": 19500,
    "ventas-al-detalle": 22500,
    "Otros": 18000
  }
  return salaries[category]
}

function renderSalary(scriptContent) {
  let categoryMatch = scriptContent.match(/utag_data\.es_sch_ad_category_level1='(.*?)'/)
  let category = null
  if (categoryMatch && categoryMatch[1]) {
    category = categoryMatch[1]
    const salaryNumber = getSalaryByCategory(category)
    let salaryContainer = document.createElement('div')
    salaryContainer.classList.add('col-4', 'col-12-medium', 'no-print')
    salaryContainer.style.marginBottom = '10px'
    salaryContainer.style.textAlign = 'center'
    let salary = document.createElement('div')
    salary.classList.add('col-child', 'inner-s', 'inner-expanded', 'panel-canvas', 'panel-rounded')
    let salaryTitle = document.createElement('h3')
    salaryTitle.style.marginBottom = '5px'
    salaryTitle.textContent = category.replace(/-/g, ' ')
    salaryTitle.style.textTransform = 'capitalize'
    salary.appendChild(salaryTitle)
    let salarySubtitle = document.createElement('p')
    salarySubtitle.style.fontSize = '12px'
    salarySubtitle.style.fontStyle = 'italic'
    salarySubtitle.style.fontWeight = 'normal'
    salarySubtitle.textContent = '(Salario medio neto anual)'
    salary.appendChild(salarySubtitle)
    let salaryValue = document.createElement('p')
    salaryValue.style.color = salaryNumber <= 18500 ? '#ff6340' : salaryNumber <= 21000 ? '#2088C2' : '#57c433';
    salaryValue.style.fontWeight = 'bold'
    salaryValue.style.fontSize = '35px'
    let formattedSalary = salaryNumber.toString().split('');
    formattedSalary.splice(2, 0, '.');
    salaryValue.textContent = formattedSalary.join('') + '€'
    salary.appendChild(salaryValue)
    salaryContainer.appendChild(salary)
    let existingElement = document.querySelector('.col-4.col-12-medium.no-print')
    let parentElement = existingElement.parentNode
    parentElement.insertBefore(salaryContainer, existingElement)
  }
}





