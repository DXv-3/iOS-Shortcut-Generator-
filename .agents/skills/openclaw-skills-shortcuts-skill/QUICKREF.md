# Shortcuts Generator Quick Reference

## Installation & Usage

```bash
# Generate pre-built shortcuts
node shortcut-cli.js hello --output hello.shortcut
node shortcut-cli.js ai --name "Ask Assistant"
node shortcut-cli.js weather
node shortcut-cli.js menu

# Sign for import
shortcuts sign --mode anyone --input hello.shortcut --output hello_signed.shortcut
```

## JavaScript API

```javascript
const { ShortcutBuilder } = require('./shortcut-builder');

// Create a shortcut
const s = new ShortcutBuilder('My Shortcut');

// Add actions
const text = s.text('Hello World!');
s.showResult(text.WFWorkflowActionParameters.UUID);

// Output as XML
fs.writeFileSync('my.shortcut', s.toXML());
```

## Action Methods

### Text & Input
| Method | Identifier | Example |
|--------|------------|---------|
| `s.text(str)` | `is.workflow.actions.gettext` | `s.text('Hello')` |
| `s.ask(prompt, type)` | `is.workflow.actions.ask` | `s.ask('Name?')` |
| `s.askLLM(promptRef)` | `is.workflow.actions.askllm` | `s.askLLM(uuid)` |
| `s.alert(title, msg)` | `is.workflow.actions.alert` | `s.alert('Hi', 'There')` |
| `s.showResult(ref)` | `is.workflow.actions.showresult` | `s.showResult(uuid)` |

### Web & URLs
| Method | Identifier | Example |
|--------|------------|---------|
| `s.getURL(url)` | `is.workflow.actions.url` | `s.getURL('https://...')` |
| `s.getContentsOfURL(ref, method)` | `is.workflow.actions.downloadurl` | `s.getContentsOfURL(uuid)` |
| `s.openURL(ref)` | `is.workflow.actions.openurl` | `s.openURL(uuid)` |

### Variables
| Method | Identifier | Example |
|--------|------------|---------|
| `s.setVariable(name, ref)` | `is.workflow.actions.setvariable` | `s.setVariable('x', uuid)` |
| `s.getVariable(name)` | `is.workflow.actions.getvariable` | `s.getVariable('x')` |

### Control Flow
| Method | Pattern | Example |
|--------|---------|---------|
| `s.repeat(n, fn)` | Loop N times | `s.repeat(5, () => {...})` |
| `s.forEach(listRef, fn)` | For each | `s.forEach(uuid, () => {...})` |
| `s.conditional(in, cond, val, ifFn, elseFn?)` | If/then/else | `s.conditional(u, 'Equals', 'hi', () => {...})` |
| `s.menu(prompt, items, cases)` | Menu | `s.menu('Pick', ['A','B'], [()=>{},()=>{}])` |

### Data
| Method | Identifier | Example |
|--------|------------|---------|
| `s.list(items)` | `is.workflow.actions.list` | `s.list(['a','b'])` |
| `s.dictionary(obj)` | `is.workflow.actions.dictionary` | `s.dictionary({k:'v'})` |

## Variable References

Action outputs are referenced by UUID. The `showResult` method accepts:
- String UUID: `s.showResult('abc-123')`
- Object with name: `s.showResult({ uuid: 'abc', outputName: 'Text' })`

## Control Flow UUIDs

Control flow actions return objects with `group` and `endUuid` for referencing inside loops:

```javascript
const { group, endUuid } = s.repeat(3, () => {
  // Use endUuid to reference the index
  s.showResult({ uuid: endUuid, outputName: 'Repeat Index' });
});
```

## Common Action Identifiers

```javascript
ShortcutBuilder.actionMap = {
  text: 'is.workflow.actions.gettext',
  showResult: 'is.workflow.actions.showresult',
  ask: 'is.workflow.actions.ask',
  askLLM: 'is.workflow.actions.askllm',
  alert: 'is.workflow.actions.alert',
  notification: 'is.workflow.actions.notification',
  openURL: 'is.workflow.actions.openurl',
  getURL: 'is.workflow.actions.url',
  getContentsOfURL: 'is.workflow.actions.downloadurl',
  getWeather: 'is.workflow.actions.weather.currentconditions',
  repeat: 'is.workflow.actions.repeat.count',
  forEach: 'is.workflow.actions.repeat.each',
  conditional: 'is.workflow.actions.conditional',
  menu: 'is.workflow.actions.choosefrommenu',
  setVariable: 'is.workflow.actions.setvariable',
  getVariable: 'is.workflow.actions.getvariable',
  list: 'is.workflow.actions.list',
  dictionary: 'is.workflow.actions.dictionary'
};
```

## Key Rules

1. **UUIDs** must be uppercase (generator handles this)
2. **WFControlFlowMode** is integer: `0=start`, `1=middle`, `2=end`
3. **Range keys** format: `{position, length}`
4. **Placeholder char**: `\uFFFC` (U+FFFC) marks variable position
5. **Matching ends**: Every control flow start needs an end action