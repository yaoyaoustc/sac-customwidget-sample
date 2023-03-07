(function () {
    let template = document.createElement("template");
    template.innerHTML = `
		  <link rel="stylesheet" type="text/css" href="https://obey.wdf.sap.corp/temp/AppDesignCustomWidgets/custom-widget-samples/sapphireGauge/sapphireGauge.css"/>
          <div id="SapphireGauge" class="sapphireGauge">
            <div id="GaugeContainer" class="sapphire-gauge-container">
                <svg id="GaugeMeter" data-name="GaugeMeter" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 102">
                    <path class="cls-1" d="M79.29,40.2l-1-1.34a10.12,10.12,0,0,0-1.05-1.3l11.28-9.72a19.3,19.3,0,0,1,1.61,2l1.52,2.07Z"/>
                    <path class="cls-1" d="M82.84,47.74c-.39-1.05-.7-2.13-1.17-3.14l13.66-5.94c.7,1.56,1.22,3.2,1.77,4.81Z"/>
                    <path class="cls-1" d="M84,56c0-1.11-.09-2.23-.16-3.34L98.63,51c.14,1.7.28,3.41.26,5.12Z"/>
                    <path class="cls-1" d="M82.69,64.22a8.84,8.84,0,0,0,.45-1.6L83.53,61l14.63,2.76-.58,2.5a18.81,18.81,0,0,1-.69,2.47Z"/>
                    <path class="cls-1" d="M79,71.69a9.13,9.13,0,0,0,.92-1.4l.85-1.44,13.15,7L92.64,78a18.73,18.73,0,0,1-1.4,2.14Z"/>
                    <path class="cls-1" d="M73.3,77.77c.91-.65,1.66-1.49,2.52-2.2L86.35,86.09c-1.27,1.13-2.47,2.37-3.85,3.38Z"/>
                    <g class="cls-2"><path class="cls-1" d="M35.42,74.61A22.1,22.1,0,0,0,37.82,77L28.11,88.23a36.3,36.3,0,0,1-3.67-3.56Z"/></g>
                    <g class="cls-3"><path class="cls-1" d="M30.79,67.71c.25.5.44,1,.73,1.5l.86,1.43L19.77,78.56l-1.31-2.21c-.44-.73-.76-1.53-1.14-2.29Z"/></g>
                    <g class="cls-4"><polygon class="cls-1" points="28.4 59.73 28.65 61.39 29.07 63.01 14.68 66.85 14.06 64.36 13.66 61.83 28.4 59.73"/></g>
                    <g class="cls-5"><path class="cls-1" d="M28.45,51.39l-.23,1.66c-.08.55,0,1.11-.08,1.67l-14.88-.55c.05-.85,0-1.71.14-2.56l.35-2.54Z"/></g>
                    <g class="cls-6"><path class="cls-1" d="M31,43.46a23.54,23.54,0,0,0-1.28,3.08l-14-4.92a38.35,38.35,0,0,1,2-4.73Z"/></g>
                    <g class="cls-7"><path class="cls-1" d="M35.72,36.61a22.88,22.88,0,0,0-2.14,2.58l-12-8.85a38.27,38.27,0,0,1,3.27-3.93Z"/></g>
                    <g class="cls-8"><path class="cls-1" d="M42.26,31.47a22.26,22.26,0,0,0-2.79,1.82l-8.84-12a34.71,34.71,0,0,1,4.29-2.8Z"/></g>
                    <g class="cls-9"><path class="cls-1" d="M50,28.48a25.74,25.74,0,0,0-3.22.93l-4.9-14.06a42,42,0,0,1,4.93-1.41Z"/></g>
                    <polygon class="cls-1" points="58.36 27.91 56.69 27.85 55.85 27.81 55.02 27.86 54.46 12.98 55.74 12.92 57.02 12.96 59.58 13.07 58.36 27.91"/>
                    <path class="cls-1" d="M66.47,29.81c-1.06-.33-2.09-.77-3.17-1L67.15,14.4c1.66.41,3.26,1,4.87,1.6Z"/>
                    <path class="cls-1" d="M73.66,34.05c-.93-.63-1.78-1.37-2.74-1.94l7.94-12.59c1.46.88,2.79,2,4.17,3Z"/>
                </svg>
            </div>
          </div>
    `;

    class Gauge extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this.properties = {
                "threshold": 0
            };
            this._minValue = 0;
            this._data = 0;
            this._container = this._shadowRoot.querySelector(`#GaugeContainer`);
        }

        onCustomWidgetBeforeUpdate(changedProps) {
            this.properties = { ...this.properties, ...changedProps };
        }

        onCustomWidgetAfterUpdate(changedProps) {
            if ("threshold" in changedProps && changedProps["threshold"] !== undefined) {
                this.properties["threshold"] = changedProps["threshold"];
                this.render();
            }
        }

		connectedCallback() {
            this.render();
		}

        onCustomWidgetResize() {
            this.render();
		}

        prepareContainer() {
            const rect = this.getBoundingClientRect();
            this._container = this._shadowRoot.querySelector(`#GaugeContainer`);
            // cleanup previous divs. They are recreated each time.
            if (this._shadowRoot.querySelector("#sapphireGaugeNeedle")){
                this._container.removeChild(this._shadowRoot.querySelector("#sapphireGaugeNeedle"));
            }
            if (this._shadowRoot.querySelector("#sapphireGaugeText")){
                this._container.removeChild(this._shadowRoot.querySelector("#sapphireGaugeText"));
            }
            // make sure the widget is always squared, regardless of the size of the SAC container
            this._minValue = Math.min(rect.width, rect.height);
            this._container.style.height = `${this._minValue}px`;
            this._container.style.width = `${this._minValue}px`;
        }

        prepareNeedle() {
            // create the needle
            const needle = document.createElement('div');
            needle.id = "sapphireGaugeNeedle";
            needle.className = "sapphire-gauge-needle";
            // position it in the middle of the widget and make it roughly 20% long, so it fits nicely in the SVG.
            needle.style.left = `${this._minValue * 0.515}px`;
            needle.style.bottom = `${this._minValue * 0.5}px`;
            needle.style.width = `${this._minValue * 0.0175}px`;
            needle.style.height = `${this._minValue * 0.2}px`;
            // useful values are 0 - 200. Though other values will also work.
            needle.style.transform = `rotate(${(-150 + (this._data / this.properties["threshold"]) * 300)}deg)`;
            // this is the circle in the base of the needle
            const needleCirlce = document.createElement('div');
            needleCirlce.id = "sapphireGaugeNeedleCircle";
            needleCirlce.className = "sapphire-gauge-needle-circle";
            needleCirlce.style.width = `${this._minValue * 0.05}px`;
            needleCirlce.style.height = `${this._minValue * 0.05}px`;
            // add the needle to the container
            needle.appendChild(needleCirlce);
            this._container.appendChild(needle);

        }

        prepareText() {
            const textDiv = document.createElement('div');
            textDiv.id = "sapphireGaugeText";
            textDiv.className = 'sapphire-gauge-text';
            // text size is dependent on the widget size
            textDiv.style.fontSize =  `${Math.round(this._minValue/100)}rem`;
            const fraction = this._data && this.properties["threshold"] ? this._data / this.properties["threshold"] : 0;
            const percentage = Math.max(0, Math.min(100, fraction * 100 ));
            textDiv.innerHTML = `${Math.round(percentage)} %`;
            this._container.appendChild(textDiv);
        }

        render() {
            this.prepareContainer();
            this.prepareNeedle();
            this.prepareText();
        }

		set gauge(data) {
            if (data.state === "error") { return; }
            this._data = Number(data.data && data.data[0] && data.data[0].measure_0 && data.data[0].measure_0.raw);
            this.render();
		}

        set dataBindings(bindings) {
            this._binding = bindings.getDataBinding("gauge");
            console.log(bindings);
        }
    }
    customElements.define('com-sap-sapphire-gauge-db', Gauge);
})();