const { ethers } = require('hardhat');
const {
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { expect } = require('chai');

const ONE_WEI = 1_000_000;
const ONE_GWEI = 1_000_000_000;

describe('Lottery', function () {
  async function deployLottery() {
    const signers = await ethers.getSigners();
    const Lottery = await hre.ethers.getContractFactory('Lottery');
    const lottery = await Lottery.deploy();
    // console.log({ lottery, signers });

    // const balances = await Promise.all(
    //   signers.map(async (owner) => await ethers.provider.getBalance(owner))
    // );
    // console.log({ balances });

    return { lottery, signers };
  }

  describe('Lottery Contract', () => {
    it('deploys a contract', async () => {
      const { lottery } = await loadFixture(deployLottery);

      expect(lottery.target).to.be;
    });

    it('allows one account to enter', async () => {
      const { lottery, signers } = await loadFixture(deployLottery);

      await lottery.enter({
        from: signers[0],
        value: ONE_GWEI,
      });

      const players = await lottery.getPlayers();

      expect(players.length).to.equal(1);
    });

    it('allows multiple accounts to enter', async () => {
      const { lottery, signers } = await loadFixture(deployLottery);

      await lottery.enter({
        value: 1000,
      });

      await lottery.connect(signers[1]).enter({
        value: 1000,
      });

      await lottery.connect(signers[2]).enter({
        value: 1000,
      });

      await lottery.connect(signers[3]).enter({
        value: 1000,
      });

      const players = await lottery.getPlayers();
      // console.log({ players });

      expect(players.length).to.equal(4);
      expect(players[0]).to.equal(signers[0]);
      expect(players[1]).to.equal(signers[1]);
    });

    it('requires a minimum amount of ether to enter', async () => {
      const { lottery } = await loadFixture(deployLottery);

      await lottery.enter({
        value: 1000,
      });

      await expect(
        lottery.enter({
          value: 0,
        })
      ).to.be.revertedWith('Min value is 1000 wei');
    });

    it('only manager can call pickWinner', async () => {
      const { lottery, signers } = await loadFixture(deployLottery);

      await expect(lottery.connect(signers[1]).pickWinner()).to.be.revertedWith(
        'This method allow only by creator'
      );
    });

    it('sends money to the winner and resets the players array', async () => {
      const { lottery, signers } = await loadFixture(deployLottery);

      await lottery.enter({
        value: 1000,
      });

      const initialBalance = await ethers.provider.getBalance(signers[0]);
      await lottery.pickWinner();
      const finalBalance = await ethers.provider.getBalance(signers[0]);

      expect(initialBalance - finalBalance).to.be.equal(57406578337988);
    });
  });
});
