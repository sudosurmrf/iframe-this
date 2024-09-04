

//input this at what ever public domain you would like to have open to users
//<script src="https://your-backend.com/widget-loader.js"></script>
//this loader is for custom widgets. (optional loader)
//<script src="https://your-backend.com/widget-loader.js?css=custom-styles.css&html=custom-content.html&js=custom-script.js&target=custom-element-id"></script>



(function() {
  function loadCSS(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }

  function injectHTML(url, targetElementId) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        document.getElementById(targetElementId).innerHTML = html;
      })
      .catch(error => console.error('Error loading HTML:', error));
  }

  function loadJS(url, callback) {
    var script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  }

  // Get query parameters (optional)
  var params = new URLSearchParams(window.location.search);
  var cssPath = params.get('css') || 'styles.css';
  var htmlPath = params.get('html') || 'content.html';
  var jsPath = params.get('js') || 'script.js';
  var targetElementId = params.get('target') || 'default-element-id';

  var baseUrl = 'https://our-backend.com/projects.assets/'; //Set your DB

  
  loadCSS(baseUrl + cssPath);

  // injects the html by elementId
  injectHTML(baseUrl + htmlPath, targetElementId);

  
  loadJS(baseUrl + jsPath, function() {
    console.log('Script loaded and executed');
  });
})();




(async function() {
  // Function to load CSS into an iframe
  async function loadCSS(iframeDocument, url, token) {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load CSS: Unauthorized or not found.');
      }

      const css = await response.text();
      const style = iframeDocument.createElement('style');
      style.textContent = css;
      iframeDocument.head.appendChild(style);

    } catch (error) {
      console.error(error);
    }
  }

  // Function to inject HTML into an iframe
  async function injectHTML(iframeDocument, url, token) {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load HTML: Unauthorized or not found.');
      }

      const html = await response.text();
      iframeDocument.body.innerHTML = html;

    } catch (error) {
      console.error(error);
    }
  }

  // Function to load JS into an iframe
  async function loadJS(iframeDocument, url, token) {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load JS: Unauthorized or not found.');
      }

      const js = await response.text();
      const script = iframeDocument.createElement('script');
      script.textContent = js;
      iframeDocument.head.appendChild(script);

    } catch (error) {
      console.error(error);
    }
  }

  // Function to initialize the iframe with the content
  async function initializeIframe(iframeId, assetPaths, token) {
    const iframe = document.getElementById(iframeId);
    if (!iframe) {
      console.error('Iframe with id ' + iframeId + ' not found.');
      return;
    }

    const iframeDocument = iframe.contentWindow.document;

    // Clear the iframe content
    iframeDocument.open();
    iframeDocument.close();

    // Load CSS, HTML, and JS into the iframe
    await loadCSS(iframeDocument, assetPaths.css, token);
    await injectHTML(iframeDocument, assetPaths.html, token);
    await loadJS(iframeDocument, assetPaths.js, token);
  }

  
  /* need to pass the initializeIframe function an id which relates to our backend asset, direct path to the correct filetype 
  and send the jwt token of the user, example below. 
  initializeIframe('iframeId', { css: 'path/to/css', html: 'path/to/html', js: 'path/to/js' }, 'jwt-token'); */

  // Example usage
  var assetId = 'asset-id'; // This should be dynamic based on user input or URL parameters
  var baseUrl = 'https://our-backend.com/assets/' + assetId + '/';

  var token = localStorage.getItem('jwt');

  var assetPaths = {
    css: baseUrl + 'styles.css',
    html: baseUrl + 'content.html',
    js: baseUrl + 'script.js'
  };

  // Initialize iframe with ID 'content-iframe' only if token is present
  if (token) {
    initializeIframe('content-iframe', assetPaths, token);
  } else {
    console.error('No valid token found. Content not loaded.');
  }

})();
