
(function(){


  let htmlToElement = function (html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  };


  let fetchIcons = new Promise((resolve, reject) => {

    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState === 4) {
        if(request.status === 200) {
          resolve(request.responseText);
        } else {
          reject('An error occurred during your request: ' +  request.status + ' ' + request.statusText);
        }
      }
    };
    request.open('Get', '/sprite/chi-icons.svg');
    request.send();

  });

  let iconsSpriteFile = fetchIcons
  //.then(response => response.text())
    .then(svgCode => htmlToElement(svgCode))
    .then(svg => Array.from(svg.childNodes).reduce( (obj, svgSymbol) => {
      obj[svgSymbol.id.substr(5)] = svgSymbol;
      return obj;
    }, {} ));


  class ChiIcon extends HTMLElement {

    constructor() {
      super();
      // Create a shadow root
      let shadow = this.attachShadow({mode: 'open'});
      this.imgUrl = 'x';

      if(this.hasAttribute('img')) {
        this.imgUrl = this.getAttribute('img');
      }

      this.svgDoc = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.svgDoc.setAttributeNS(null, 'viewBox', '0 0 16 16');

      this.updateImage();

      const style = document.createElement('style');
      style.textContent = `
                        svg {
                            height: 100%;
                            left: 0;
                            position: absolute;
                            top: 0;
                            width: 100%;
                            overflow: hidden;
                        }
                        `;

      shadow.appendChild(style);
      shadow.appendChild(this.svgDoc);

    }

    updateImage() {
      iconsSpriteFile.then(symbols => {
        let svgSymbol = symbols[this.imgUrl];

        while (this.svgDoc.firstChild) {
          this.svgDoc.removeChild(this.svgDoc.firstChild);
        }

        Array.from(svgSymbol.childNodes).forEach(pathElement => {
          if (pathElement.className) {
            pathElement.setAttributeNS(null, 'fill', 'currentColor');
            this.svgDoc.appendChild(pathElement.cloneNode(true));
          }
        });
      });
    }

    static get observedAttributes() { return ['img']; }
    attributeChangedCallback(attr, oldValue, newValue) {
      if (attr === 'img') {
        this.imgUrl = newValue;
        this.updateImage();
      }
    }

  }

  customElements.define('chi-icon', ChiIcon);

})();
