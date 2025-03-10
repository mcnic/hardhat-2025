const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('LotteryModule', (m) => {
  const inbox = m.contract('Lottery');
  return { inbox };
});
