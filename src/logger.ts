import {
  CONFIG_NAMES,
  MESSAGE_LEVEL_TYPES,
  noop,
} from './const';
import { trimObject } from './utils';
import { ILogger } from './interfaces';
import {
  LOG_LEVELS_ON_FAIL_DEFAULT,
  LOG_LEVELS_ON_SUCCESS_DEFAULT, LOG_LEVELS_TO_SEND_ON_FAIL_DEFAULT,
  LOG_LEVELS_TO_SEND_ON_SUCCESS_DEFAULT,
} from './defaults';

const levelStrings = Object.fromEntries(Object.entries(MESSAGE_LEVEL_TYPES).map(([k, v]) => [v, k]));

const status = { singletonConnected: false };
export const markAsConnectedToSingleton = () => {
  status.singletonConnected = true;
};

interface EventLoggerData {
  sourceEvent: any
  eventSequence: string[]
  objectsToPrint: {
    type: MESSAGE_LEVEL_TYPES,
    messages: string[]
  }[]
}

const storage: Record<string, EventLoggerData> = {};

interface ILoggerSettings {
  logOnSuccess: Record<CONFIG_NAMES, MESSAGE_LEVEL_TYPES>
  logOnFail: Record<CONFIG_NAMES, MESSAGE_LEVEL_TYPES>
  sendOnSuccess: Record<CONFIG_NAMES, MESSAGE_LEVEL_TYPES>
  sendOnFail: Record<CONFIG_NAMES, MESSAGE_LEVEL_TYPES>
}

export const settings: ILoggerSettings = {
  logOnSuccess: LOG_LEVELS_ON_SUCCESS_DEFAULT,
  logOnFail: LOG_LEVELS_ON_FAIL_DEFAULT,
  sendOnSuccess: LOG_LEVELS_TO_SEND_ON_SUCCESS_DEFAULT,
  sendOnFail: LOG_LEVELS_TO_SEND_ON_FAIL_DEFAULT,
};

export const parseMessage = (messages: any[]) => messages.map(el => {
  let res = trimObject(el);
  if (typeof res === 'object') {
    res = JSON.stringify(res);
  }
  return res;
}).join(' ');

export const logImmediate = (uid: string | null, ...stringMessage: any[]) => {
  let messageToPrint: string;
  if (stringMessage.length) {
    messageToPrint = parseMessage(stringMessage);
  } else {
    messageToPrint = uid || 'null message  in logger, smth went wrong';
  }
  // eslint-disable-next-line no-console
  console.log(messageToPrint);
};

const saveLog = (uid: string | null, type: MESSAGE_LEVEL_TYPES, messages: string[]) => {
  if (status.singletonConnected) {
    if (!storage[uid || 'null']) {
      storage[uid || 'null'] = { sourceEvent: null, eventSequence: [], objectsToPrint: [] };
    }
    storage[uid || 'null'].objectsToPrint.push({ type, messages });
  } else {
    logImmediate(uid, messages);
  }
};

export const prepareSaved = (uid: string, minLevel: MESSAGE_LEVEL_TYPES): string | undefined => storage[uid]?.objectsToPrint
  ?.filter(({ type }) => type >= minLevel)
  ?.map(({ type, messages }) => `${levelStrings[type].toUpperCase()}: ${parseMessage(messages)}`)
  ?.join('\n');

export const formatUnifiedResultMessage = (uid: string, message: string | undefined) => `${message}\n\nSource event: ${
  JSON.stringify(storage[uid]?.sourceEvent, null, '\t')
}\n\nEvent sequence: ${storage[uid]?.eventSequence?.join(', ')}`;

export const clearSaved = (uid: string) => {
  delete storage[uid];
};

// todo add some place inside transaction system to obtain not only uid but smth more
// todo hide this into transaction
export const addSourceEvent = <TEvent extends { info: () => {source: any, typeName: string, actionName: string, uid: string } }>(event: TEvent) => {
  const {
    source, typeName, actionName, uid,
  } = event.info();

  if (!storage[uid]) {
    storage[uid] = {
      sourceEvent: { ...source, uid },
      eventSequence: [],
      objectsToPrint: [],
    };
  }
  storage[uid].eventSequence.push([typeName, actionName].join(' '));
};

const minLevelToProcess = Math.min(...Object.values(settings).map(ll => ll[process.env.NODE_ENV as CONFIG_NAMES]));

const log = logImmediate;

const initLogLevels = () => {
  const [d, i, w, e] = Object.values(MESSAGE_LEVEL_TYPES).filter(x => typeof x === 'number')
    .map(type => ((type < minLevelToProcess)
      ? noop
      : (uid :string | null, ...messages: string[]) => saveLog(uid, +type, messages)
    ));
  return [d, i, w, e];
};

let [debug, info, warning, error] = initLogLevels();

export const getSettings = () => JSON.parse(JSON.stringify(settings)) as ILoggerSettings;
export const updateSettings = (newSetting: ILoggerSettings) => {
  settings.logOnFail = newSetting.logOnFail;
  settings.logOnSuccess = newSetting.logOnSuccess;
  settings.sendOnFail = newSetting.sendOnFail;
  settings.sendOnSuccess = newSetting.sendOnSuccess;
  [debug, info, warning, error] = initLogLevels();
};

export const logger: ILogger = {
  debug,
  info,
  log,
  warning,
  error,
};
