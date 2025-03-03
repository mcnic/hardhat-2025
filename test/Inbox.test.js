const { expect } = require('chai');

describe('Inbox', function () {
  let inbox;

  beforeEach(async function () {
    const Inbox = await ethers.getContractFactory('Inbox');
    inbox = await Inbox.deploy('Hi there!');
  });

  it('deploys a contract', function () {
    expect(inbox.target).to.be.a('string');
  });

  it('has a default message', async function () {
    expect(await inbox.message()).to.equal('Hi there!');
  });

  it('can change the message', async function () {
    await inbox.setMessage('bye');
    expect(await inbox.message()).to.equal('bye');
  });
});
