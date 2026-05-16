const { ShortcutBuilder } = require('../shortcut-builder');
const fs = require('fs');

module.exports = (ShortcutBuilder, builder) => {
  const s = builder || new ShortcutBuilder('Countdown Timer');
  
  const count = s.ask('Count down from what number?', 'Number');
  
  s.conditional(
    count.WFWorkflowActionParameters.UUID,
    'Is Greater Than',
    '0',
    () => {
      s.repeat(10, () => {
        s.text('Tick');
      });
    },
    () => {
      s.alert('Invalid Input', 'Please enter a positive number');
    }
  );
  
  return s;
};