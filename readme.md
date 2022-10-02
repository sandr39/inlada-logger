# Transaction-oriented Logger for Inlada framework 

Basic usage:

```typescript
import { logger } from 'inlada-logger';

logger.log('maessage');
```

Connection to `inlada-transaction-processor`:
```typescript
import { loggerTransactionServiceFabric } from 'inlada-logger';

const doWithLogsSmthOnSuccessOrFail = async (uid: string, message: string) => someServices.processLogs(uid, message);
transactionProcessor.registerTransactionService(loggerTransactionServiceFabric(doWithLogsSmthOnSuccessOrFail));
```
