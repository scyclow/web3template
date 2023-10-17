const bnToN = bn => Number(bn.toString())
const ethVal = n => Number(ethers.utils.formatEther(n))
const truncateAddr = addr => addr.slice(0, 6) + '...' + addr.slice(-4)
const toETH = amt => ethers.utils.parseEther(String(amt))
const ethValue = amt => ({ value: toETH(amt) })
const isENS = ens => ens.slice(-4) === '.eth'
const ZERO_ADDR = '0x0000000000000000000000000000000000000000'


async function formatAddr(addr, provider, truncate=true) {
  try {
    const ens = await provider.getENS(addr)
    if (ens.slice(-4) === '.eth') {
      return ens.length > 10
        ? ens.slice(0, 10) + '...'
        : ens
    } else {
      return truncate ? truncateAddr(addr) : addr
    }
  } catch (e) {
    return truncate ? truncateAddr(addr) : addr
  }
}


class Web3Provider {
  onConnectCbs = []

  constructor() {
    if (window.ethereum) {
      console.log('web3')
      try {
        this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
        this.isEthBrowser = true


        ethereum.on('accountsChanged', () => this.connect())
      } catch (e) {
        console.error(e)
      }

    } else {
      console.log('no Web3 detected')
      this.isEthBrowser = false
    }
  }

  onConnect(cb) {
    this.onConnectCbs.push(cb)
    this.isConnected()
      .then(addr => {
        if (addr) {
          cb(addr)
        }
      })
  }

  async connect() {
    const addr = await this.isConnected()
    this.onConnectCbs.forEach(async cb => cb(addr))
  }

  get signer() {
    return this.provider.getSigner()
  }

  async isConnected() {
    if (!this.isEthBrowser) return false

    try {
      return await this.signer.getAddress()
    } catch (e) {
      return false
    }
  }

  rawContract(contractAddr, abi) {
    return new ethers.Contract(contractAddr, abi, this.provider)
  }

  async contract(contractAddr, abi) {
    const signer = await this.isConnected()
    console.log(signer)
    return (new ethers.Contract(contractAddr, abi, this.provider)).connect(this.signer)
  }

  async getENS(addr) {
    return this.provider.lookupAddress(addr)
  }

  async getETHBalance(addr) {
    return this.provider.getBalance(addr)
  }

  async getNetwork() {
    return this.provider.getNetwork()
  }
}



