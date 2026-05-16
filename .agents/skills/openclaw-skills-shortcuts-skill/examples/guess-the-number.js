const { ShortcutBuilder } = require('../shortcut-builder');

module.exports = (ShortcutBuilder, builder) => {
  const s = builder || new ShortcutBuilder('Number Guessing Game');
  
  const guess = s.ask('Guess a number (1-100)', 'Number');
  
  s.conditional(
    guess.WFWorkflowActionParameters.UUID,
    'Equals',
    '42',
    () => {
      s.alert('Correct!', 'You guessed it!');
    },
    () => {
      s.conditional(
        guess.WFWorkflowActionParameters.UUID,
        'Is Greater Than',
        '42',
        () => s.alert('Too High', 'Try a lower number'),
        () => s.alert('Too Low', 'Try a higher number')
      );
    }
  );
  
  return s;
};