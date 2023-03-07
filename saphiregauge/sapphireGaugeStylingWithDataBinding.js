(function() {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
				<table>
					<tr>
						<td>Threshold</td>
						<td><input id="sps_threshold" type="text" size="40" maxlength="40"></td>
					</tr>
				</table>
				<input type="submit" style="display:none;">
		</form>
	`;

	class GaugeStylingPanel extends HTMLElement {
		constructor() {
			super();
			console.log("styling: constructor()");
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
			this._props = {};
		}

		connectedCallback() {
			console.log(`styling[${this._props["widgetName"]}]: connectedCallback()`);
		}

		disconnectedCallback() {
			console.log(`styling[${this._props["widgetName"]}]: disconnectedCallback()`);
		}

		onCustomWidgetBeforeUpdate(changedProps) {
			this._props = { ...this._props, ...changedProps };
			console.log(`styling[${this._props["widgetName"]}]: onCustomWidgetBeforeUpdate(${JSON.stringify(changedProps)})`);
		}

		onCustomWidgetAfterUpdate(changedProps) {
			console.log(`styling[${this._props["widgetName"]}]: onCustomWidgetAfterUpdate(${JSON.stringify(changedProps)})`);
		}

		onCustomWidgetDestroy() {
			console.log(`styling[${this._props["widgetName"]}]: onCustomWidgetDestroy()`);
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							threshold: this.threshold,
						}
					}
			}));
		}

		set threshold(newThreshold) {
			this._shadowRoot.getElementById("sps_threshold").value = newThreshold;
		}

		get threshold() {
			return this._shadowRoot.getElementById("sps_threshold").value;
		}
	}

	customElements.define("com-sap-sample-gauge-styling", GaugeStylingPanel);
})();