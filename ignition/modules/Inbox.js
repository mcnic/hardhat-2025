const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('InboxModule', (m) => {
  const inbox = m.contract('Inbox', ['Hi there!']);
  return { inbox };
});
