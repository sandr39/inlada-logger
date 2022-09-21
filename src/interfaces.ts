export interface ILogger {
  debug: (...messages: any) => void,
  info: (...messages: any) => void,
  log: (...messages: any) => void,
  warning: (...messages: any) => void,
  error: (...messages: any) => void,
}

export type ILogTransportSendFunction = (uid: string, message: string) => void;

export type ITransactionFn = (uid: string) => Promise<void>;

export interface ITransactionService {
  onStart?: ITransactionFn,
  onSuccess?: ITransactionFn,
  onFail?: ITransactionFn,
}
