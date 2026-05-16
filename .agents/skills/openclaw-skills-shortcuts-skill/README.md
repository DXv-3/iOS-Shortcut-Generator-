# macOS Shortcuts Generator

Generate valid `.shortcut` files for Apple's Shortcuts app.

## Quick Start

```bash
# Pre-built shortcuts
node shortcut-cli.js hello --output hello.shortcut
node shortcut-cli.js ai --output ask-ai.shortcut
node shortcut-cli.js weather --output weather.shortcut

# Sign for import (macOS only)
shortcuts sign --mode anyone --input hello.shortcut --output hello_signed.shortcut
```

## Files

| File | Purpose |
|------|---------|
| `shortcut-builder.js` | JavaScript API for programmatic generation |
| `shortcut-cli.js` | Command-line interface for quick shortcuts |
| `SKILL.md` | Complete documentation |
| `PLIST_FORMAT.md` | Plist structure reference |
| `ACTIONS.md` | All 427 action identifiers |
| `CONTROL_FLOW.md` | Repeat, conditional, menu patterns |
| `EXAMPLES.md` | Copy-paste ready XML examples |
| `QUICKREF.md` | Quick reference for JS API and CLI |
| `examples/` | Custom script examples |

## JavaScript API

```javascript
const { ShortcutBuilder } = require('./shortcut-builder');
const fs = require('fs');

const s = new ShortcutBuilder('My Shortcut');

// Chain actions
const text = s.text('Hello World!');
s.showResult(text.WFWorkflowActionParameters.UUID);

fs.writeFileSync('my.shortcut', s.toXML());
```

## CLI Usage

```bash
node shortcut-cli.js <command> [options]

Commands:
  hello              Hello World shortcut
  ask                Ask user for input
  ai                 AI query shortcut
  weather            Weather + AI report
  menu               Menu demo
  custom <file>      Run custom JS script

Options:
  --name <name>      Shortcut name
  --output <file>    Output filename (default: shortcut.shortcut)
  --help             Show help
```

## Custom Scripts

Create a JS file that exports a function:

```javascript
// my-shortcut.js
module.exports = (ShortcutBuilder, builder) => {
  const s = builder || new ShortcutBuilder('My Shortcut');
  
  const name = s.ask('Your name?');
  s.alert('Hello', `Hi ${name.uuid}!`);
  
  return s;
};
```

Then run:
```bash
node shortcut-cli.js custom my-shortcut.js --output my.shortcut
```

## Signing Shortcuts

Shortcuts must be signed before import:

```bash
# On macOS
shortcuts sign --mode anyone --input my.shortcut --output my_signed.shortcut

# Or convert formats
plutil -convert binary1 my.shortcut
```

## Documentation

- **SKILL.md** - Main documentation with examples
- **QUICKREF.md** - Quick reference for APIs
- **ACTIONS.md** - Complete action catalog
- **CONTROL_FLOW.md** - Loops, conditionals, menus
- **EXAMPLES.md** - Working XML examples