import ua from 'universal-analytics'
import { logWarning, logInfo } from './log_manager';

const tracker = ua('UA-163934012-1', 'Server', { strictCidFormat: false }, { dh: 'https://outside-the-box.herokuapp.com/'});

export function trackMetric(action: string, label: string, value: any): void {
  if (process.env.NODE_ENV === 'development') {
    logInfo(`[MOCK ONLY] Tracked Metric: ${action} - ${label} - ${value}`);
  } else {
    tracker.event("Server Metric", action, label, value, (err) => {
      if (err) {
        logWarning(`Could not track metric: ${err}`);
      } else {
        logInfo(`Tracked Metric: ${action} - ${label} - ${value}`);
      }
    });
  }
}
