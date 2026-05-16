const crypto = require('crypto');

class ShortcutBuilder {
  constructor(name = 'My Shortcut') {
    this.name = name;
    this.actions = [];
    this.imports = [];
    this.inputTypes = [];
  }

  _uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = crypto.randomInt(16);
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16).toUpperCase();
    });
  }

  _createAction(identifier, parameters) {
    const action = {
      WFWorkflowActionIdentifier: identifier,
      WFWorkflowActionParameters: parameters
    };
    this.actions.push(action);
    return action;
  }

  text(text, uuid = null) {
    const id = uuid || this._uuid();
    return this._createAction('is.workflow.actions.gettext', { UUID: id, WFTextActionText: text });
  }

  showResult(textRef) {
    const attachments = {};
    const rangeKey = '{0, 1}';
    
    if (typeof textRef === 'string') {
      attachments[rangeKey] = {
        OutputUUID: textRef,
        OutputName: 'Text',
        Type: 'ActionOutput'
      };
    } else if (textRef && textRef.uuid && textRef.outputName) {
      attachments[rangeKey] = {
        OutputUUID: textRef.uuid,
        OutputName: textRef.outputName,
        Type: 'ActionOutput'
      };
    }

    return this._createAction('is.workflow.actions.showresult', {
      Text: {
        Value: {
          attachmentsByRange: attachments,
          string: '\uFFFC'
        },
        WFSerializationType: 'WFTextTokenString'
      }
    });
  }

  ask(prompt, inputType = 'Text') {
    const id = this._uuid();
    return this._createAction('is.workflow.actions.ask', {
      UUID: id,
      WFAskActionPrompt: prompt,
      WFInputType: inputType
    });
  }

  askLLM(promptRef, model = 'Apple Intelligence', resultType = 'Text') {
    const id = this._uuid();
    const attachments = {};
    
    if (typeof promptRef === 'string') {
      attachments['{0, 1}'] = {
        OutputUUID: promptRef,
        OutputName: 'Provided Input',
        Type: 'ActionOutput'
      };
    }

    return this._createAction('is.workflow.actions.askllm', {
      UUID: id,
      WFLLMModel: model,
      WFGenerativeResultType: resultType,
      WFLLMPrompt: {
        Value: {
          attachmentsByRange: attachments,
          string: '\uFFFC'
        },
        WFSerializationType: 'WFTextTokenString'
      }
    });
  }

  alert(title, message) {
    return this._createAction('is.workflow.actions.alert', {
      WFAlertActionTitle: title,
      WFAlertActionMessage: message
    });
  }

  notification(title, body) {
    return this._createAction('is.workflow.actions.notification', {
      WFNotificationActionTitle: title,
      WFNotificationActionBody: body
    });
  }

  openURL(urlRef) {
    const input = typeof urlRef === 'string' 
      ? { OutputUUID: urlRef, Type: 'ActionOutput' }
      : urlRef;
    
    return this._createAction('is.workflow.actions.openurl', { WFInput: input });
  }

  getURL(url) {
    const id = this._uuid();
    return this._createAction('is.workflow.actions.url', { UUID: id, WFURLActionURL: url });
  }

  getContentsOfURL(urlRef, method = 'GET') {
    const input = typeof urlRef === 'string'
      ? { OutputUUID: urlRef, Type: 'ActionOutput' }
      : urlRef;
    
    return this._createAction('is.workflow.actions.downloadurl', {
      WFURL: input,
      WFHTTPMethod: method
    });
  }

  getWeather() {
    const id = this._uuid();
    return this._createAction('is.workflow.actions.weather.currentconditions', { UUID: id });
  }

  repeat(count, actionsFn, groupId = null) {
    const group = groupId || this._uuid();
    
    this._createAction('is.workflow.actions.repeat.count', {
      GroupingIdentifier: group,
      WFControlFlowMode: 0,
      WFRepeatCount: count
    });

    const innerActions = actionsFn();
    const endUuid = this._uuid();

    this._createAction('is.workflow.actions.repeat.count', {
      UUID: endUuid,
      GroupingIdentifier: group,
      WFControlFlowMode: 2
    });

    return { group, endUuid };
  }

  forEach(eachRef, actionsFn, groupId = null) {
    const group = groupId || this._uuid();
    const input = typeof eachRef === 'string' 
      ? { OutputUUID: eachRef, OutputName: 'List', Type: 'ActionOutput' }
      : eachRef;

    this._createAction('is.workflow.actions.repeat.each', {
      GroupingIdentifier: group,
      WFControlFlowMode: 0,
      WFInput: {
        Value: input,
        WFSerializationType: 'WFTextTokenAttachment'
      }
    });

    actionsFn();
    const endUuid = this._uuid();

    this._createAction('is.workflow.actions.repeat.each', {
      UUID: endUuid,
      GroupingIdentifier: group,
      WFControlFlowMode: 2
    });

    return { group, endUuid };
  }

  conditional(inputRef, condition, comparison, actionsFn, otherwiseFn = null, groupId = null) {
    const group = groupId || this._uuid();
    const input = typeof inputRef === 'string'
      ? { OutputUUID: inputRef, OutputName: 'Text', Type: 'ActionOutput' }
      : inputRef;

    this._createAction('is.workflow.actions.conditional', {
      GroupingIdentifier: group,
      WFControlFlowMode: 0,
      WFCondition: condition,
      WFInput: {
        Value: input,
        WFSerializationType: 'WFTextTokenAttachment'
      },
      WFConditionalActionString: comparison
    });

    actionsFn();

    if (otherwiseFn) {
      this._createAction('is.workflow.actions.conditional', {
        GroupingIdentifier: group,
        WFControlFlowMode: 1
      });
      otherwiseFn();
    }

    this._createAction('is.workflow.actions.conditional', {
      GroupingIdentifier: group,
      WFControlFlowMode: 2
    });
  }

  menu(prompt, items, cases, groupId = null) {
    const group = groupId || this._uuid();

    this._createAction('is.workflow.actions.choosefrommenu', {
      GroupingIdentifier: group,
      WFControlFlowMode: 0,
      WFMenuPrompt: prompt,
      WFMenuItems: items
    });

    for (let i = 0; i < items.length; i++) {
      this._createAction('is.workflow.actions.choosefrommenu', {
        GroupingIdentifier: group,
        WFControlFlowMode: 1,
        WFMenuItemTitle: items[i]
      });
      cases[i]();
    }

    this._createAction('is.workflow.actions.choosefrommenu', {
      GroupingIdentifier: group,
      WFControlFlowMode: 2
    });
  }

  setVariable(name, valueRef) {
    const input = typeof valueRef === 'string'
      ? { OutputUUID: valueRef, Type: 'ActionOutput' }
      : valueRef;
    
    return this._createAction('is.workflow.actions.setvariable', {
      WFVariableName: name,
      WFInput: input
    });
  }

  getVariable(name) {
    const id = this._uuid();
    return this._createAction('is.workflow.actions.getvariable', {
      UUID: id,
      WFVariable: name
    });
  }

  list(items) {
    const id = this._uuid();
    return this._createAction('is.workflow.actions.list', {
      UUID: id,
      WFItems: items
    });
  }

  dictionary(items) {
    const id = this._uuid();
    return this._createAction('is.workflow.actions.dictionary', {
      UUID: id,
      WFItems: Object.entries(items).map(([key, value]) => ({
        WFKey: key,
        WFValue: value
      }))
    });
  }

  inputTypes(types) {
    this.inputTypes = types;
    return this;
  }

  build() {
    const plist = {
      WFWorkflowActions: this.actions,
      WFWorkflowClientVersion: '2700.0.4',
      WFWorkflowClientRelease: '26A0000a',
      WFWorkflowMinimumClientVersion: 900,
      WFWorkflowMinimumClientVersionString: '900',
      WFWorkflowIcon: {
        WFWorkflowIconGlyphNumber: 59511,
        WFWorkflowIconStartColor: 4282601983
      },
      WFWorkflowName: this.name,
      WFWorkflowHasOutputFallback: false,
      WFWorkflowImportQuestions: [],
      WFWorkflowOutputContentItemClasses: [],
      WFWorkflowTypes: []
    };

    if (this.inputTypes.length > 0) {
      plist.WFWorkflowInputContentItemClasses = this.inputTypes;
    }

    return plist;
  }

  toXML() {
    const plist = this.build();
    return plistToXML(plist);
  }
}

function escapeXML(str) {
  return String(str).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function plistToXML(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n`;
  xml += `<plist version="1.0">\n`;
  xml += dictToXML(obj, 1);
  xml += '</plist>\n';
  return xml;
}

function dictToXML(dict, indent) {
  const spaces = '  '.repeat(indent);
  let xml = `${spaces}<dict>\n`;
  
  for (const [key, value] of Object.entries(dict)) {
    xml += `${spaces}  <key>${escapeXML(key)}</key>\n`;
    xml += valueToXML(value, indent + 1);
  }
  
  xml += `${spaces}</dict>\n`;
  return xml;
}

function arrayToXML(arr, indent) {
  const spaces = '  '.repeat(indent);
  let xml = `${spaces}<array>\n`;
  
  for (const item of arr) {
    xml += valueToXML(item, indent + 1);
  }
  
  xml += `${spaces}</array>\n`;
  return xml;
}

function valueToXML(value, indent) {
  const spaces = '  '.repeat(indent);
  
  if (typeof value === 'string') {
    return `${spaces}<string>${escapeXML(value)}</string>\n`;
  }
  
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return `${spaces}<integer>${value}</integer>\n`;
    }
    return `${spaces}<real>${value}</real>\n`;
  }
  
  if (typeof value === 'boolean') {
    return `${spaces}<${value}/>\n`;
  }
  
  if (value === null || value === undefined) {
    return `${spaces}<dict/>\n`;
  }
  
  if (Array.isArray(value)) {
    return arrayToXML(value, indent);
  }
  
  if (typeof value === 'object') {
    return dictToXML(value, indent);
  }
  
  return `${spaces}<string>${escapeXML(String(value))}</string>\n`;
}

module.exports = { ShortcutBuilder };

const actionMap = {
  text: 'gettext',
  showResult: 'showresult',
  ask: 'ask',
  alert: 'alert',
  notification: 'notification',
  openURL: 'openurl',
  getURL: 'url',
  getContentsOfURL: 'downloadurl',
  getWeather: 'weather.currentconditions',
  repeat: 'repeat.count',
  forEach: 'repeat.each',
  conditional: 'conditional',
  menu: 'choosefrommenu',
  setVariable: 'setvariable',
  getVariable: 'getvariable',
  list: 'list',
  dictionary: 'dictionary',
  askLLM: 'askllm'
};

ShortcutBuilder.actionMap = actionMap;
ShortcutBuilder.categories = {
  text: ['gettext', 'ask', 'askllm', 'showresult', 'alert', 'notification'],
  variables: ['setvariable', 'getvariable'],
  flow: ['repeat.count', 'repeat.each', 'conditional', 'choosefrommenu'],
  web: ['url', 'downloadurl', 'openurl'],
  weather: ['weather.currentconditions'],
  data: ['list', 'dictionary']
};