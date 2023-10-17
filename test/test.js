const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')
const { expectRevert, time, snapshot } = require('@openzeppelin/test-helpers')

const toETH = amt => ethers.utils.parseEther(String(amt))
const bidAmount = amt => ({ value: toETH(amt) })
const ethVal = n => Number(ethers.utils.formatEther(n))
const num = n => Number(n)


function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

const utf8Clean = raw => raw.replace(/data.*utf8,/, '')
const getJsonURI = rawURI => JSON.parse(utf8Clean(rawURI))



const ONE_DAY = 60 * 60 * 24
const TEN_MINUTES = 60 * 10
const ZERO_ADDR = '0x0000000000000000000000000000000000000000'
const safeTransferFrom = 'safeTransferFrom(address,address,uint256)'


const expectOwnableError = p => expectRevert(p, 'Ownable: caller is not the owner')
const contractBalance = contract => contract.provider.getBalance(contract.address)

let admin, signer1, signer2, steviep
let TestContract, TestURI, TestMinter, ExistingContract


const testSetup = async () => {
  const signers = await ethers.getSigners()

  admin = signers[0]
  signer1 = signers[1]
  signer2 = signers[2]

  const steviep = await ethers.getImpersonatedSigner('0x47144372eb383466D18FC91DB9Cd0396Aa6c87A4')


  const TestContractFactory = await ethers.getContractFactory('TestContract', admin)
  TestContract = await TestContractFactory.deploy()
  await TestContract.deployed()


  const TestURIFactory = await ethers.getContractFactory('TestURI', admin)
  TestURI = await TestURIFactory.attach(
    await TestContract.connect(admin).uriContract()
  )

  const TestMinterFactory = await ethers.getContractFactory('TestMinter', admin)
  TestMinter = await TestMinterFactory.attach(
    await TestContract.connect(admin).minterContract()
  )


  ExistingContract = await ethers.getContractAt(
    [
      'function transferFromBank(address to, uint256 amount) external',
      'function balanceOf(address account) external view returns (uint256)'
    ],
    '0xcA5228D1fe52D22db85E02CA305cddD9E573D752'
  )

}





describe('SteviepAuction', () => {
  beforeEach(async () => {
    await testSetup()
  })

  describe('create', () => {
    it('happy path', async () => {


    })
  })

})



