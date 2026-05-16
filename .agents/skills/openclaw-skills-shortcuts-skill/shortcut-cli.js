#!/usr/bin/env node

const { ShortcutBuilder } = require('./shortcut-builder');
const fs = require('fs');
const path = require('path');

const commands = {
  help() {
    console.log(`
Shortcuts Generator CLI
========================

Usage: node shortcut-cli.js <command> [options]

Commands:
  hello                 Generate a "Hello World" shortcut
  ask                   Generate an ask-for-input shortcut
  ai                    Generate an AI query shortcut  
  weather               Generate a weather report shortcut
  menu                  Generate a menu demo shortcut
  custom <file>         Load and run a custom script

Options:
  --name <name>         Name of the shortcut (default: from template)
  --output <file>       Output file (default: shortcut.shortcut)
  --help                Show this help

Examples:
  node shortcut-cli.js hello --name "My Hello" --output hello.shortcut
  node shortcut-cli.js ai --name "Ask AI"
  node shortcut-cli.js custom my-script.js

For custom scripts, create a JS file that exports a function receiving ShortcutBuilder:

  module.exports = (ShortcutBuilder, builder) => {
    builder.text("Hello").showResult("uuid-here");
    return builder;
  };
`);
  },

  hello(_, opts) {
    const builder = new ShortcutBuilder(opts.name || 'Hello World');
    const textAction = builder.text('Hello World!');
    builder.showResult(textAction.WFWorkflowActionParameters.UUID);
    return builder;
  },

  ask(_, opts) {
    const builder = new ShortcutBuilder(opts.name || 'Ask User');
    const askAction = builder.ask('What is your name?');
    builder.showResult({ uuid: askAction.WFWorkflowActionParameters.UUID, outputName: 'Provided Input' });
    return builder;
  },

  ai(_, opts) {
    const builder = new ShortcutBuilder(opts.name || 'Ask AI');
    const askAction = builder.ask('What would you like to ask?');
    const llmAction = builder.askLLM(askAction.WFWorkflowActionParameters.UUID);
    builder.showResult({ uuid: llmAction.WFWorkflowActionParameters.UUID, outputName: 'Response' });
    return builder;
  },

  weather(_, opts) {
    const builder = new ShortcutBuilder(opts.name || 'Weather Report');
    const weatherAction = builder.getWeather();
    const promptAction = builder.text('Generate a friendly weather report based on this data:\uFFFC\n\nKeep it brief.', weatherAction.WFWorkflowActionParameters.UUID);
    const llmAction = builder.askLLM(promptAction.WFWorkflowActionParameters.UUID);
    builder.showResult({ uuid: llmAction.WFWorkflowActionParameters.UUID, outputName: 'Response' });
    return builder;
  },

  menu(_, opts) {
    const builder = new ShortcutBuilder(opts.name || 'Menu Demo');
    builder.menu(
      'What would you like to do?',
      ['Say Hello', 'Say Goodbye', 'Tell a Joke'],
      [
        () => builder.showResult('Hello there! Nice to meet you.'),
        () => builder.showResult('Goodbye! See you next time.'),
        () => builder.showResult('Why do programmers prefer dark mode? Because light attracts bugs!')
      ]
    );
    return builder;
  },

  custom(args, opts) {
    if (!args[0]) {
      console.error('Error: Custom script path required');
      process.exit(1);
    }
    
    const scriptPath = path.resolve(args[0]);
    if (!fs.existsSync(scriptPath)) {
      console.error(`Error: Script not found: ${scriptPath}`);
      process.exit(1);
    }
    
    const script = require(scriptPath);
    const builder = new ShortcutBuilder(opts.name || 'Custom Shortcut');
    
    if (typeof script === 'function') {
      return script(ShortcutBuilder, builder) || builder;
    }
    
    return builder;
  }
};

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const opts = {};
  
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--name' && args[i + 1]) {
      opts.name = args[++i];
    } else if (args[i] === '--output' && args[i + 1]) {
      opts.output = args[++i];
    }
  }
  
  return { command, args: args.slice(1), opts };
}

function main() {
  const { command, args, opts } = parseArgs();
  
  if (!command || command === '--help' || command === '-h') {
    return commands.help();
  }
  
  const cmd = commands[command];
  if (!cmd) {
    console.error(`Unknown command: ${command}`);
    console.error('Run with --help for usage');
    process.exit(1);
  }
  
  try {
    const builder = cmd(args.slice(1), opts);
    const xml = builder.toXML();
    const output = opts.output || 'shortcut.shortcut';
    
    fs.writeFileSync(output, xml);
    console.log(`✓ Generated ${output}`);
    console.log(`  Actions: ${builder.actions.length}`);
    console.log(`\nNext: shortcuts sign --mode anyone --input ${output} --output ${output.replace('.shortcut', '_signed.shortcut')}`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();