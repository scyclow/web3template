
const $ = (elem, prop, value) => elem.style[prop] = value
$.cls = (selector, elem=document) => Array.isArray(elem)
  ? elem.map(e => $.cls(e, selector)).flat()
  : Array.from(elem.getElementsByClassName(selector))

$.id = (selector, elem=document) => Array.isArray(elem)
  ? elem.find(e => $.id(e, selector))
  : elem.getElementById(selector)


$.render = (e, children) => {
  if (!children) return
  else if (typeof children === 'string') e.textContent = children
  else if (Array.isArray(children)) {
    if (typeof children[0] === 'string') {
      children.forEach(child => {
        e.textContent += (
          typeof child === 'string' ? child : child.outerHTML
        )
      })
    } else {
      e.append(...children.flat())
    }
  }
  else {
    e.append(children)
  }
}


$.create = elType => (children, attrs={}) => {
  const e = document.createElement(elType)
  $.render(e, children)

  Object.keys(attrs).forEach(a => {
    e.setAttribute(a, attrs[a])
  })

  return e
}

$.a = $.create('a')
$.div = $.create('div')
$.span = $.create('span')
$.main = $.create('main')
$.section = $.create('section')


const $html = document.getElementsByTagName('html')[0]

let queryParams

try {
  queryParams = window.location.search
    ? window.location.search.replace('?', '').split('&').reduce((params, i) => {
        const [k, v] = i.split('=')
        params[k] = v
        return params
      }, {})
    : {}
} catch (e) {
  queryParams = {}
}




const addMetaTag = (args) => {
  const meta = document.createElement('meta')
  Object.keys(args).forEach(arg => {
    meta[arg] = args[arg]
  })

  document.head.appendChild(meta)
}

const addThumbnail = (fill) => {
  const existing = document.getElementById('favicon')
  if (existing) document.head.removeChild(existing)
  const link = document.createElement('link')
  link.href = `data:image/svg+xml;base64,${btoa(
    `<svg viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1" height="1" fill="${fill}"></rect></svg>`
  )}`
  link.rel = 'shortcut icon'
  link.type = 'image/svg+xml'
  link.id = 'favicon'
  document.head.appendChild(link)
}

function css(style) {
  const s = document.createElement('style')
  s.innerHTML = style
  document.head.appendChild(s)
}


function setMetadata(usedContent) {
  $html.translate = false
  $html.lang = 'en'
  $html.className = 'notranslate'

  const title = usedContent.join(' ')

  document.title = title

  addMetaTag({ name: 'google', content: 'notranslate' })
  addMetaTag({ name: 'description', content: title })
  addMetaTag({ name: 'keywords', content: usedContent.join(', ').toLowerCase() })

  setRunInterval(() => {
    addThumbnail(
      BW
        ? prb(0.5) ? '#000' : '#fff'
        : getShadowColor(chooseHue())
    )
  }, 1000)

  console.log(title)
}

const ls = {
  get(key) {
    try {
      return window.localStorage && window.localStorage.getItem && JSON.parse(window.localStorage.getItem(key))
    } catch (e) {
      console.log(e)
    }
  },
  set(key, value) {
    try {
      return window.localStorage.setItem(key, value)
    } catch (e) {
      console.log(e)
    }
  }
}


function unhide(element) {
  $(element, 'display', '')
}

function hide(element) {
  $(element, 'display', 'none')
}

function setRunInterval(fn, ms, i=0) {
  const run = () => {
    fn(i)
    i++
  }

  run()

  let isCleared = false

  let interval = setInterval(run, ms)

  const newInterval = (ms) => {
    if (isCleared) return
    clearInterval(interval)
    interval = setInterval(run, ms)
  }

  const stopInterval = () => {
    if (!isCleared) {
      clearInterval(interval)
      isCleared = true
    }
  }
  return stopInterval
}