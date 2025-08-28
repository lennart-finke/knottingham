    

      window.globals = {neighbors:0, strokeWidth:5, gapWidth:2, strokeColor:'black', showIntersections:true, independentHandles: false, smooth:false, isomorphy:true};
      var polynomial = document.getElementById('alexanderPolynomial');
      var jonesPolynomial = document.getElementById('jonesPolynomial');
      var candidates = document.getElementById('candidates');
      var candidates_p = document.getElementById('candidates-p');
      var smoothing = document.getElementById('smoothing');
      var dragging = document.getElementById('dragging');
      var isomorphy = document.getElementById('isomorphy');
      var showIntersections = document.getElementById('showIntersections');
      var dragIndependently = document.getElementById('dragIndependently');
      var dt = document.getElementById('dt');
      var log = document.getElementById('log');
      var gauss = document.getElementById('gauss');
      var orthButton = document.getElementById('orthButton');
      var jonesButton = document.getElementById('jonesButton');
      var homflyButton = document.getElementById('homflyButton');
      var dtInput = document.getElementById('dtInput');
      var rolfsenInput = document.getElementById('rolfsenInput');

      isomorphy.checked = smoothing.checked = showIntersections.checked = true;
      dragging.checked = dragIndependently.checked = false;

      function flatten() {
        smoothing.checked = false;
        window.globals.flatten();
      }
      function straighten() {
        smoothing.checked = false;
        window.globals.straighten();
      }

      function toTikz() {
        var string =  window.globals.toTikz();
        navigator.clipboard.writeText(string);
      }

      function readJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          window.globals.fromJSON(e.target.result);
        };
        reader.readAsText(file);
      }

      function toSVG() {
        // Kindly provided by users senz, Dave and defghi 1977
        // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
        var svg =  window.globals.toSVG();

        // Sanitize empty stroke-dasharray attributes which some tools reject
        (function sanitizeSVGDashArrays(root) {
          if (!root) return;
          function fixNode(node) {
            if (!node || !node.getAttribute) return;
            if (node.hasAttribute && node.hasAttribute('stroke-dasharray')) {
              var val = node.getAttribute('stroke-dasharray');
              if (val === null || /^\s*$/.test(val)) {
                node.setAttribute('stroke-dasharray', 'none');
              }
            }
            var style = node.getAttribute('style');
            if (style && /stroke-dasharray\s*:\s*;/.test(style)) {
              node.setAttribute('style', style.replace(/stroke-dasharray\s*:\s*;?/g, 'stroke-dasharray:none;'));
            }
          }
          // Check the root and then traverse descendants
          fixNode(root);
          var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
          var current = walker.nextNode();
          while (current) {
            fixNode(current);
            current = walker.nextNode();
          }
        })(svg);

        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        var svgData = svg.outerHTML;
        var preface = '<?xml version="1.0" standalone="no"?>\r\n';
        var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = "knottingham";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }

      function toJSON() {
        // Many thanks to users bformet and volzoran
        // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser

        var jsonString =  window.globals.toJSON();
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
        var dl = document.createElement("a");
        dl.setAttribute("href", dataStr);
        dl.setAttribute("download", "knot.knottingham");
        dl.click();
        document.body.removeChild(dl);
      }

      var pyodide = null;
      
      async function getPyodide(display) {
        if (pyodide == null) {
          display.innerHTML = "loading... [1/7]";
          pyodide = await loadPyodide();
          display.innerHTML = "loading... [2/7]";
          await pyodide.loadPackage("micropip");
          display.innerHTML = "loading... [3/7]";
          const micropip = pyodide.pyimport("micropip");
          await micropip.install("sqlite3");
          display.innerHTML = "loading... [4/7]";
          await micropip.install('knot_floer_homology-1.2-cp311-cp311-emscripten_3_1_45_wasm32.whl');
          display.innerHTML = "loading... [5/7]";
          await micropip.install('snappy_manifolds-1.2-py3-none-any.whl');
          display.innerHTML = "loading... [6/7]";
          await micropip.install('spherogram-2.2.1-cp311-cp311-emscripten_3_1_45_wasm32.whl');
        }
      }

      async function orthogonalise(button, code, codeType, successString, errorString) {
        if (window.globals.getNumIntersections() < 3) {
          button.innerHTML = ">2 crossings needed.";
          return;
        }
        smoothing.checked = false;
        await getPyodide(button);
        

        if (codeType == "DT") {
          if (code == "") {
            code = "4 6 2";
          }
          linkString = "DT:[("+code.replaceAll(" ", ", ")+")]";
        } else if (codeType == "Rolfsen") {
          if (code == "") {
            code = "10_161";
          }
          linkString = code;
        }

        try {
          let geometry = pyodide.runPython(`
            from spherogram.links import Link
            from spherogram.links.orthogonal import OrthogonalLinkDiagram

            from pyodide.ffi import to_js

            l = Link("` + linkString + `")
            o = OrthogonalLinkDiagram(l)
            to_js(o.plink_data())`);
          window.globals.fromSnappy(geometry);
          button.innerHTML = successString;
        } catch(err) {
          console.error(err);
          button.innerHTML = errorString;
        }
      }
      
      function runSage(code, callback, display) {
        // Using SageMathCell API adapted from
        // https://github.com/sagemath/sagecell/blob/master/contrib/sagecell-client/sagecell-service.py
        // The right thing to do here would be using
        // https://github.com/sagemath/sagecell/blob/master/contrib/sagecell-client/sagecell-client.py
        // However, the Javascript Websocket API doesn't allow headers when creating a connection, so the Jupyter-Kernel-ID cannot be sent as intended, resulting in a 403.
        retries = 3;
        display.innerHTML = "Loading SageCell";
        async function executeRequest() {
          const url = 'https://sagecell.sagemath.org/service';
          const requestBody = {
              code: code,
              accepted_tos: "true"
          };

          fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams(requestBody)
          })
          .then(response => response.json())
          .then(reply => {
              if (reply['success'] && 'stdout' in reply) {
                  callback(reply['stdout'], display);
              } else {
                  console.log(reply);
                  if (retries > 0) {
                      setTimeout(executeRequest, 500);
                  } else {
                      display.innerHTML = "Connection to SageCell failed.";
                  }
              }
          })
          .catch(error => {
            console.error(error);
              if (retries > 0) {
                  setTimeout(executeRequest, 500);
              } else {
                display.innerHTML = "Connection to SageCell failed.";
              }
          });
        }
        executeRequest();
      }

      function getJones() {
        const code = 'K = Knots().from_dowker_code([' + dt.innerHTML +'])\nprint(K.jones_polynomial())';

        runSage(code,function(result, jonesButton) {
          jonesPolynomial.innerHTML = "\\(" + "p_J(t)=" + result.replaceAll("*", "") + "\\)";
          if (window.MathJax) {MathJax.typeset();}
          document.getElementById('jonesContainer').style.display = "block";
          jonesButton.innerHTML = "Refresh Jones Polynomial" 
        },jonesButton);
      }
      function getHomfly() {
        const code = 'K = Knots().from_dowker_code([' + dt.innerHTML +"])\nprint(K.homfly_polynomial())";

        runSage(code,function(result, homflyButton) {
          document.getElementById('homflyContainer').style.display = "block";
          homflyPolynomial.innerHTML = "p_HOM(M,L)=" + result;
          homflyButton.innerHTML = "Refresh HOMFLY Polynomial";
        },homflyButton);
      }