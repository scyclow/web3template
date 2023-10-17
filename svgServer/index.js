
const express = require('express')
const hardhat = require('hardhat')

const app = express()

app.get('/', async (_, res) => {
  try {
    // will recompile if there are changes
    await hardhat.run('compile')

    // Grab SVG content from renderer

    const OffOnMock = await hardhat.ethers.getContractFactory('OffOnMock', {})

    const ooMock = await OffOnMock.deploy()
    await ooMock.deployed()

    OffOnURIFactory = await hardhat.ethers.getContractFactory('OffOnURI')

    const OffOnURI = await OffOnURIFactory.attach(
      await ooMock.tokenURIContract()
    )

    console.log(ooMock.address)
    console.log(OffOnURI.address)

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
    await ooMock.turnOn()
    console.log('lklklklklk')
    const tokenURI = await ooMock.tokenURI(0)
    console.log('WTF??', tokenURI)


    const tokenURIStr = tokenURI.replace('data:application/json;utf8,', '')
    console.log('>>>>>', tokenURIStr)
    const encodedSVG = JSON.parse(tokenURIStr).image.replace('data:image/svg+xml;base64,', '')
    const decodedSVG = Buffer.from(encodedSVG, 'base64').toString('utf8')

    // Will refresh every 1 second
    res.send(`
      <html>
      <head>
        <style>
          * {
            margin: 1vw;
            padding: 1vw;
            box-sizing: border-box;
          }

          body {

          }

          svg {
            box-shadow: 4px 4px 10px
          }
        </style>
      </head>
      <body>
      ${decodedSVG}
      </body>
      <style>body{margin:0;padding:0;}</style>
      <script>console.log(JSON.parse('${tokenURIStr}'))</script>
      </html>
    `)
  } catch (e) {
    // in case you grab compiler errors
    res.send(`
      <html>
        <head>

        </head>
          ${e}
      </html>
  `)
  }
})

const PORT = process.env.PORT || 5005
app.listen(PORT, () => {
  console.log(`Serving SVG on port ${PORT}`)
})