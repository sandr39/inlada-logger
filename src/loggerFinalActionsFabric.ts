import moment from 'moment';
import {
  clearSaved, formatUnifiedResultMessage, markAsConnectedToSingleton, prepareSaved, settings,
} from './logger';

import { CONFIG_NAMES } from './const';
import { ILogTransportSendFunction, ITransactionService } from './interfaces';

const { NODE_ENV } = process.env as { NODE_ENV: CONFIG_NAMES };

const finalizeAndSend = async (
  uid: string,
  levelToSend : number,
  levelToLog: number,
  logTransportSendFunction: ILogTransportSendFunction,
  logTime: boolean,
  serviceName?: string,
) => {
  const serviceInfo = `${logTime ? moment().format() : ''} ${serviceName || ''}`;

  const logsToConsole = prepareSaved(uid, levelToLog);
  const logsToSend = prepareSaved(uid, levelToSend);

  if (logsToSend?.length) {
    await logTransportSendFunction(uid, formatUnifiedResultMessage(uid, serviceInfo + logsToSend));
  }

  if (logsToConsole?.length) {
    // eslint-disable-next-line no-console
    console.log(serviceInfo + logsToConsole);
  }

  clearSaved(uid);
};

const finalizeOnSuccess = (logTransportSendFunction: ILogTransportSendFunction) => async (uid: string) => {
  await finalizeAndSend(
    uid,
    settings.sendOnSuccess[NODE_ENV],
    settings.logOnSuccess[NODE_ENV],
    logTransportSendFunction,
    settings.logTime,
    settings.serviceName,
  );
  await finalizeAndSend(
    'null',
    settings.sendOnSuccess[NODE_ENV],
    settings.logOnSuccess[NODE_ENV],
    logTransportSendFunction,
    settings.logTime,
    settings.serviceName,
  );
};

const finalizeOnFail = (logTransportSendFunction: ILogTransportSendFunction) => async (uid: string) => {
  await finalizeAndSend(
    uid,
    settings.sendOnFail[NODE_ENV],
    settings.logOnFail[NODE_ENV],
    logTransportSendFunction,
    settings.logTime,
    settings.serviceName,
  );
  await finalizeAndSend(
    'null',
    settings.sendOnFail[NODE_ENV],
    settings.logOnFail[NODE_ENV],
    logTransportSendFunction,
    settings.logTime,
    settings.serviceName,
  );
};

export const loggerTransactionServiceFabric = (logTransportSendFunction: ILogTransportSendFunction): ITransactionService => {
  markAsConnectedToSingleton();
  return {
    onFail: finalizeOnFail(logTransportSendFunction),
    onSuccess: finalizeOnSuccess(logTransportSendFunction),
  } as ITransactionService;
};
