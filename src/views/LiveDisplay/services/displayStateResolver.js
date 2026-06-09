export const PRIORITY = {
  emergency: 6,
  adhan: 5,
  iqomah: 4,
  live: 3,
  popup: 2,
  normal: 1
};

export const resolveState = (currentState, incomingEvent) => {
  const currentPriority = PRIORITY[currentState.mode] || 0;
  const incomingPriority = PRIORITY[incomingEvent.mode] || 0;

  // State machine logic
  if (incomingEvent.action === 'start') {
    if (incomingPriority >= currentPriority) {
      return { ...currentState, mode: incomingEvent.mode, data: incomingEvent.data };
    }
  } else if (incomingEvent.action === 'stop') {
    if (currentState.mode === incomingEvent.mode) {
      // Fallback logic
      if (incomingEvent.mode === 'iqomah') {
         // If we stopped iqomah, check if live was active
         if (currentState.previousMode === 'live') {
             return { ...currentState, mode: 'live' };
         }
      }
      return { ...currentState, mode: 'normal', data: null };
    }
  }

  return currentState;
};

export const getActiveContent = (contents) => {
  const now = new Date();
  return contents.filter(c => {
    if (!c.is_active) return false;
    if (c.start_at && new Date(c.start_at) > now) return false;
    if (c.end_at && new Date(c.end_at) < now) return false;
    return true;
  }).sort((a, b) => b.priority - a.priority);
};
