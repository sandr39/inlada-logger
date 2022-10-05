## Transaction-oriented Logger for Inlada framework 

###Usage:

Connection to [inlada-transaction-processor](https://github.com/sandr39/inlada-transaction-processor):
```typescript
import { loggerTransactionServiceFabric } from 'inlada-logger';

const doWithLogsSmthOnSuccessOrFail = async (uid: string, message: string) => someServices.processLogs(uid, message);
transactionProcessor.registerTransactionService(loggerTransactionServiceFabric(doWithLogsSmthOnSuccessOrFail));
```

`doWithLogsSmthOnSuccessOrFail` will be called only in the end of transaction

```typescript
import { logger } from 'inlada-logger';

logger.log('message'); // ==> immediate console.log
logger.error(uid, 'error message'); // ==> console.log in the end of transaction, + doWithLogsSmthOnSuccessOrFail(`error message`)
```

### Configuration

```typescript
import { updateSettings } from 'inlada-logger';

updateSettings({
  logOnSuccess: {
    [CONFIG_NAMES.local]: MESSAGE_LEVEL_TYPES.warning,
    [CONFIG_NAMES.development]: MESSAGE_LEVEL_TYPES.debug,
    [CONFIG_NAMES.production]: MESSAGE_LEVEL_TYPES.debug,
  },
  logOnFail: {
    [CONFIG_NAMES.local]: MESSAGE_LEVEL_TYPES.error,
    [CONFIG_NAMES.development]: MESSAGE_LEVEL_TYPES.debug,
    [CONFIG_NAMES.production]: MESSAGE_LEVEL_TYPES.warning,
  },
  sendOnSuccess: {
    [CONFIG_NAMES.local]: MESSAGE_LEVEL_TYPES.nothing,
    [CONFIG_NAMES.development]: MESSAGE_LEVEL_TYPES.warning,
    [CONFIG_NAMES.production]: MESSAGE_LEVEL_TYPES.warning,
  },
  sendOnFail: {
    [CONFIG_NAMES.local]: MESSAGE_LEVEL_TYPES.nothing,
    [CONFIG_NAMES.development]: MESSAGE_LEVEL_TYPES.warning,
    [CONFIG_NAMES.production]: MESSAGE_LEVEL_TYPES.warning,
  },
} as ILoggerSettings);
```
,
