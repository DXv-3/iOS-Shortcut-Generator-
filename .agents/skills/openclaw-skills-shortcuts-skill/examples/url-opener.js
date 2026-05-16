const { ShortcutBuilder } = require('../shortcut-builder');

module.exports = (ShortcutBuilder, builder) => {
  const s = builder || new ShortcutBuilder('URL Opener');
  
  const url = s.ask('Enter URL:', 'URL');
  s.openURL(url.WFWorkflowActionParameters.UUID);
  
  return s;
};