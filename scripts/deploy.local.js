const ONE_DAY = 60 * 60 * 24
const TEN_MINUTES = 60 * 10
const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

async function main() {
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

  console.log(`TestContract:`, TestContract.address)
  console.log(`TestURI:`, TestURI.address)
  console.log(`TestMinter:`, TestMinter.address)
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });