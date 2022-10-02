export interface ILogger {
  debug: (uid: string | null, ...messages: any) => void,
  info: (uid: string | null, ...messages: any) => void,
  log: (uid: string | null, ...messages: any) => void,
  warning: (uid: string | null, ...messages: any) => void,
  error: (uid: string | null, ...messages: any) => void,
}

export type ILogTransportSendFunction = (uid: string, message: string) => void;

export type ITransactionFn = (uid: string) => Promise<void>;

export interface ITransactionService {
  onStart?: ITransactionFn,
  onSuccess?: ITransactionFn,
  onFail?: ITransactionFn,
}
