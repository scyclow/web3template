
const _BaseComponent = (templateCloneFn, observedAttributes=[]) => class extends HTMLElement {
  constructor() {
    super()
    this.attrs = {}
    this.cloneTemplate = templateCloneFn
    this.template = this.cloneTemplate()
  }

  static get observedAttributes() {
    return observedAttributes
  }


  update(property, newValue) {
    this.attributeChangedCallback(property, null, newValue)
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return
    this.attrs[property] = newValue
    if (this.connectedShadow) {
      this.connectedShadow.innerHTML = ''
      this.connectedShadow.append(
        this.render(
          this.cloneTemplate(),
          this.attrs
        )
      )
    }
  }

  connectedCallback() {
    this.connectedShadow = this.attachShadow({ mode: 'open' })
    this.render(this.template, this.attrs)
    this.connectedShadow.append(this.template)
  }


  render(template, attrs) {
    return template
  }

  forceRender() {
    return this.render(this.template, this.attrs)
  }

}


const BaseTemplateComponent = (templateContent, observedAttributes) => _BaseComponent(
  () => {
    const template = document.createElement('template')
    template.innerHTML = templateContent
    return template
  },
  observedAttributes
)

const BaseComponent = (templateName, observedAttributes) => _BaseComponent(
  () => document.getElementById(templateName).content.cloneNode(true),
  observedAttributes
)

const mountComponents = (...components) => components.forEach(c => customElements.define(c.name, c))


