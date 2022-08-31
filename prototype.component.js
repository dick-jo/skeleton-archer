// ------------------------------------------------------------
// Prototype
// ------------------------------------------------------------
export class SkeletonArcher extends HTMLElement {

  constructor(HTML, CSS, PROPS, RELS, ARIA) {
    super() // REQUIRED: Initialises HTML element
    this._internals = this.attachInternals() // REQUIRED: Provides Element Internals API

    this._init(HTML, CSS, PROPS, RELS, ARIA)
    this._render()
  }

  // ------------------------------------------------------------
  // Lifecycle
  // ------------------------------------------------------------
  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(name, oldVal, newVal) {
    oldVal !== newVal && this._render() // Re-render element when attributes are changed
  }

  // ------------------------------------------------------------
  // Framework
  // ------------------------------------------------------------
  _init(HTML, CSS, PROPS, RELS, ARIA) {
    // Create component anatomy
    PROPS && (this._props = structuredClone(PROPS)) // Deep copy of props constant (Important!)
    this._template = document.createElement('template')
    this._style = document.createElement('link')
    this._shadow = this.attachShadow({ mode: 'open' })

    // Populate template and append to shadow DOM
    HTML && (this._template.innerHTML = HTML)
    this._shadow.appendChild(this._template.content.cloneNode(true))

    CSS && this._attachStyle(CSS) // Attach stylesheet if CSS const provided

    if (this._props && Object.keys(this._props).length !== 0) {
      this._attachElements()
      this._reflectAttributes()
      this._reflectProps()
    }

    RELS && (this._rels = structuredClone(RELS)) && this._attachRels() // Deep copy of rels constant, then attach related elements

    ARIA && this._ariaInit(ARIA) // Set ARIA values if provided
  }

  _attachStyle(CSS) {
    this._style.setAttribute('rel', 'stylesheet')
    this._style.setAttribute('href', CSS)
    this._shadow.appendChild(this._style.cloneNode(true))
  }

  _attachElements() {
    for (const prop in this._props) {
      this._props[prop].el = this._shadow.querySelector(this._props[prop].sel) // Attaches corresponding DOM elements to respective items in props object
    }
  }

  _attachRels() {
    for (const rel in this._rels) {
      let el = this._shadow.querySelector(this._rels[rel].sel)
      this._rels[rel].el = el
    }
  }

  _reflectProps() {
    for (const prop in this._props) {
      this._props[prop].val && this.setAttribute(prop, this._props[prop].val)
    }
  } // Used for pushing props -> attributes

  _reflectAttributes() {
    for (const prop in this._props) {
      this.attributes[prop] && (this._props[prop].val = this.attributes[prop].value)
    } // Used for pushing attributes -> props
  }

  // ------------------------------------------------------------
  // Events
  // ------------------------------------------------------------
  _emit(ev, detail) {
    this.dispatchEvent(
      new CustomEvent(ev, {
        bubbles: true,
        composed: true,
        detail: detail
      })
    )
  }

  // ------------------------------------------------------------
  // Accessibility
  // ------------------------------------------------------------
  _ariaInit(ARIA) {
    for (const i in ARIA) {
      this._internals[`aria${i.charAt(0).toUpperCase() + i.slice(1)}`] = ARIA[i] // Append 'aria-' to aria object keys before adding to element internals
      this.setAttribute(
        i.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase()),
        ARIA[i]
      ) // Convert camelcase aria object key to kebab case before setting attribute on html element
    }
  }
}
