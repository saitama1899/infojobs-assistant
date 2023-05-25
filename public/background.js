/* global chrome */

let clientId = '9a3461370cad412298bebf3dec098ede'
const clientSecret = "DCDxBw9SLFwVP8rmJL1Td4uAEQseSMLIPeUM01b6vXR/BLYxOq";
const redirectUri = "https://ijkeilgfehinjmckjafpllcoonflgcfh.chromiumapp.org/"
const scope = "MY_APPLICATIONS,CANDIDATE_PROFILE_WITH_EMAIL,CANDIDATE_READ_CURRICULUM_SKILLS,CANDIDATE_READ_CURRICULUM_CVTEXT,CANDIDATE_READ_CURRICULUM_EDUCATION,CANDIDATE_READ_CURRICULUM_EXPERIENCE,CANDIDATE_READ_CURRICULUM_FUTURE_JOB,CV";
let authUrl = `https://www.infojobs.net/api/oauth/user-authorize/index.xhtml?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
let isAuthenticating = false;

function fetchToken(authCode) {
  const tokenUrl = 'https://www.infojobs.net/oauth/authorize'
  const body = `grant_type=authorization_code&client_id=${clientId}&client_secret=${encodeURIComponent(clientSecret)}&code=${authCode}&redirect_uri=${encodeURIComponent(redirectUri)}`

  fetch(tokenUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  })
  .then(res => res.json())
  .then(data => {
    if (!data.access_token) {
        console.log('Failed to obtain access token')
        return;
    }

    // Calculate the expiration time
    const now = new Date().getTime();
    const expiresInMilliseconds = (data.expires_in || 3600) * 1000;  // if expires_in is not present, defaulting to 1 hour
    const expirationTime = now + expiresInMilliseconds;

    // Save the access token and the expiration time
    chrome.storage.local.set({accessToken: data.access_token, expirationTime}, function() {
        if (chrome.runtime.lastError) {
            console.error('Error setting access token:', chrome.runtime.lastError)
        } else {
            console.log('Token is stored in local storage')
        }
    });
  })
  .catch(err => console.log(err))
}

function initiateAuthenticationFlow() {
  if (isAuthenticating) {
    // Ya está en curso la autenticación
    return;
  }

  isAuthenticating = true;

  chrome.identity.launchWebAuthFlow({
    'url': authUrl,
    'interactive': true
  }, function(redirectedTo) {
    isAuthenticating = false; // resetear la bandera cuando la autenticación ha terminado

    if (chrome.runtime.lastError) {
      if (chrome.runtime.lastError.message !== 'The user did not approve access.') {
        console.error(chrome.runtime.lastError.message)
      }
    } else {
      let url = new URL(redirectedTo)
      let params = new URLSearchParams(url.search)
      let authCode = params.get('code')
      if (authCode) {
        fetchToken(authCode)
      } else {
        console.error('No authorization code found in the redirected URL.')
      }
    }
  })
}

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.url.includes('infojobs.net') && details.url !== authUrl) {
    // Inicia el flujo de autenticación cada vez que visitas 'infojobs.net'
    chrome.storage.local.get(['accessToken', 'expirationTime'], function(result) {
      const now = new Date().getTime();

      if (!result.accessToken || now >= result.expirationTime) {
        // If no access token exists or if the token has expired, initiate a new authentication flow
        initiateAuthenticationFlow();
      } else {
        console.log('Access token already exists:', result.accessToken)
      }
    })
  }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if (request.message === "getAccessToken") {
    chrome.storage.local.get(['accessToken', 'expirationTime'], function(result) {
      const now = new Date().getTime();
      if (!result.accessToken || now >= result.expirationTime) {
        // Si no existe un token de acceso o si el token ha expirado, envía una respuesta indicando que el token no es válido
        sendResponse({status: 'invalid_token'});
      } else {
        sendResponse({accessToken: result.accessToken})
      }
    });

    // Indicar que la respuesta se enviará de forma asincrónica
    return true;
  }

  if (request.message === "fetchApiData") {
    fetch("https://ifa-api-blush.vercel.app/api/infojobs", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            accessToken: request.accessToken, 
            offerId: request.offerId
        })
    })
    .then(response => response.json())
    .then(data => {
        // Haz algo con los datos recibidos
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }
})
