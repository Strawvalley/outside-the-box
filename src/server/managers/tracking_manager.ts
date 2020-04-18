import ua from 'universal-analytics'
import { logWarning, logInfo } from './log_manager';

const trackingId = `Server${process.env.NODE_ENV === 'development' ? '-DEV' : ''}`;

const tracker = ua(
  'UA-163934012-1',
  trackingId,
  { strictCidFormat: false },
  { dh: 'https://outside-the-box.herokuapp.com/'}
);

export function trackMetric(action: string, label: string, value: any): void {
  tracker.event("Server Metric", action, label, value, { value: value }, (err) => {
    if (err) {
      logWarning(`[${trackingId}] Could not track metric: ${err}`);
    } else {
      logInfo(`[${trackingId}] Tracked Metric: ${action} - ${label} - ${value}`);
    }
  });
}
