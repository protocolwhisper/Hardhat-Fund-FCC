const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
!developmentChains.includes(network.name)
    ? describe.skip
    : //Test
      describe("FundMe", async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1") // 1 eth
          beforeEach(async function () {
              //Deploy out FundMe contract
              //Using Hardhat-deploy
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer) // When we call fundme it'll be always from the deployer account
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", async function () {
              it("sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async function () {
              it("Fails if you don't send enough eth", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Didn't send enough bro"
                  )
              })

              it("Update the data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Add funder to array of  getFunder", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getFunder(0)
                  assert.equal(response, deployer)
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("Whitdraw all the money in the contract", async function () {
                  // Arrange
                  const startingFundmeBalance =
                      await fundMe.provider.getBalance(fundMe.address) // We use provider cause we put the deployer inside the contract in the FundMe variable

                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act

                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { effectiveGasPrice, gasUsed } = transactionReceipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })
              it("allow the withdraw with multiple  getFunder", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners() // We get the accounts
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue }) // Here with the interation we send value to our contract
                  }

                  const startingFundmeBalance =
                      await fundMe.provider.getBalance(
                          fundMe.address // Cause we need to check if the amount withdrawed effectively transfer or no
                      ) // We use provider cause we put the deployer inside the contract in the FundMe variable
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1) // The deployer cause he's the owner of the contract
                  const { effectiveGasPrice, gasUsed } = transactionReceipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Assert

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  //Make sure that the founders are ressetted
                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      ) //All the values must be equal to zero cause they are ressetted
                  }
              })

              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  //console.log(await fundMeConnectedContract.withdraw())
                  await expect(fundMeConnectedContract.withdraw()).to.be
                      .reverted
                  //"FundMe__NotOwner()"
                  //)
                  //console.log(await fundMeConnectedContract.withdraw())
              })
              //function revertReason(reason) {
              //   return `VM Exception while processing transaction: reverted with custom error '${reason}'`
              // }

              it("cheaperWithdraw testing...", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners() // We get the accounts
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue }) // Here with the interation we send value to our contract
                  }

                  const startingFundmeBalance =
                      await fundMe.provider.getBalance(
                          fundMe.address // Cause we need to check if the amount withdrawed effectively transfer or no
                      ) // We use provider cause we put the deployer inside the contract in the FundMe variable
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Act
                  const transactionResponse = await fundMe.CheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1) // The deployer cause he's the owner of the contract
                  const { effectiveGasPrice, gasUsed } = transactionReceipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Assert

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  //Make sure that the founders are ressetted
                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      ) //All the values must be equal to zero cause they are ressetted
                  }
              })
              it("CheapWhitdraw all the money in the contract", async function () {
                  // Arrange
                  const startingFundmeBalance =
                      await fundMe.provider.getBalance(fundMe.address) // We use provider cause we put the deployer inside the contract in the FundMe variable

                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act

                  const transactionResponse = await fundMe.CheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { effectiveGasPrice, gasUsed } = transactionReceipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })
          })
      })
