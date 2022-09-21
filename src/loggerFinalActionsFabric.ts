import {
  clearSaved, formatUnifiedResultMessage, markAsConnectedToSingleton, prepareSaved, settings,
} from './logger';

import { CONFIG_NAMES } from './const';
import { ILogTransportSendFunction, ITransactionService } from './interfaces';

const { NODE_ENV } = process.env as { NODE_ENV: CONFIG_NAMES };

const finalizeOnSuccess = (logTransportSendFunction: ILogTransportSendFunction) => async (uid: string) => {
  const logsToConsole = prepareSaved(uid, settings.logOnSuccess[NODE_ENV]);
  const logsToSend = prepareSaved(uid, settings.sendOnSuccess[NODE_ENV]);

  if (logsToSend?.length) {
    await logTransportSendFunction(uid, formatUnifiedResultMessage(uid, logsToSend));
  }

  if (logsToConsole) {
    // eslint-disable-next-line no-console
    console.log(logsToConsole);
  }

  clearSaved(uid);
};

const finalizeOnFail = (logTransportSendFunction: ILogTransportSendFunction) => async (uid: string) => {
  await logTransportSendFunction(uid, formatUnifiedResultMessage(uid, prepareSaved(uid, settings.sendOnFail[NODE_ENV])));

  // eslint-disable-next-line no-console
  console.log(prepareSaved(uid, settings.sendOnFail[NODE_ENV]));
  clearSaved(uid);
};

export const loggerTransactionServiceFabric = (logTransportSendFunction: ILogTransportSendFunction): ITransactionService => {
  markAsConnectedToSingleton();
  return {
    onFail: finalizeOnFail(logTransportSendFunction),
    onSuccess: finalizeOnSuccess(logTransportSendFunction),
  } as ITransactionService;
};
