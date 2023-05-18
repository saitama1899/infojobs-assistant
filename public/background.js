/* global chrome */

let clientId = '9a3461370cad412298bebf3dec098ede'
const clientSecret = "DCDxBw9SLFwVP8rmJL1Td4uAEQseSMLIPeUM01b6vXR/BLYxOq";
const redirectUri = "https://ijkeilgfehinjmckjafpllcoonflgcfh.chromiumapp.org/"
// const redirectUri = "http://www.infojobs.net/core/oauth2vc/index.xhtml"
// const redirectUri = chrome.identity.getRedirectURL()
const scope = "MY_APPLICATIONS,CANDIDATE_PROFILE_WITH_EMAIL,CANDIDATE_READ_CURRICULUM_SKILLS,CV";
let authUrl = `https://www.infojobs.net/api/oauth/user-authorize/index.xhtml?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`

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

    // Now you have the access token, you can save it for later use
    console.log('Access token:', data.access_token)

    // You may want to save it to the chrome local storage
    chrome.storage.local.set({accessToken: data.access_token}, function() {
        console.log('Token is stored in local storage')
    });
  })
  .catch(err => console.log(err))
}

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.url.includes('infojobs.net')) {
    // Inicia el flujo de autenticación cada vez que visitas 'infojobs.net'
    chrome.identity.launchWebAuthFlow({
      'url': authUrl,
      'interactive': true
    }, function(redirectedTo) {
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
})

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.message === "getAccessToken") {
      chrome.storage.local.get('accessToken', function(result) {
        console.log('Access token: ' + result.accessToken);
      });
    }
  }
);