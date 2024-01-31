function random(mn, mx) {
  const out = Math.random()
  if (mx != null) return mn + out * (mx - mn)
  else if (mn != null) return out * mn
  else return out
}

const int = parseInt
const rndint = (mn, mx) => int(random(mn, mx))
const prb = x => random() < x
const sample = (a) => a[int(random(a.length))]
const posOrNeg = () => prb(0.5) ? 1 : -1
const exists = x => !!x
const last = a => a[a.length-1]
const noop = () => {}

const deepEquals = (a, b) => (
  Object.keys(a).length === Object.keys(b).length
  && Object.keys(a).every(aKey => a[aKey] === b[aKey])
)

function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

function chance(...chances) {
  const total = chances.reduce((t, c) => t + c[0], 0)
  const seed = random()
  let sum = 0
  for (let i = 0; i < chances.length; i++) {
    const val =
      chances[i][0] === true ? 1
      : chances[i][0] === false ? 0
      : chances[i][0]
    sum += val / total
    if (seed <= sum && chances[i][0]) return chances[i][1]
  }
}


function setRunInterval(fn, ms, i=0) {
  const run = () => {
    fn(i)
    i++
  }

  run()

  return setInterval(run, ms)
}

// const lineStats = (x1, y1, x2, y2) => ({
//   d: dist(x1, y1, x2, y2),
//   angle: atan2(x2 - x1, y2 - y1)
// })

// function getXYRotation (deg, radius, cx=0, cy=0) {
//   return [
//     sin(deg) * radius + cx,
//     cos(deg) * radius + cy,
//   ]
// }

// const rndChar = () => sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))