import { supabase } from '../../../lib/supabase';

class SocketService {
  constructor() {
    this.channel = null;
    this.listeners = new Map();
  }

  connect(displayCode) {
    if (this.channel) {
      this.channel.unsubscribe();
    }

    this.channel = supabase.channel(`display_${displayCode}`);

    this.channel.on('broadcast', { event: 'update-state' }, (payload) => this.trigger('update-state', payload.payload));
    this.channel.on('broadcast', { event: 'reload' }, () => this.trigger('reload'));
    this.channel.on('broadcast', { event: 'show-popup' }, (payload) => this.trigger('show-popup', payload.payload));
    this.channel.on('broadcast', { event: 'start-live' }, (payload) => this.trigger('start-live', payload.payload));
    this.channel.on('broadcast', { event: 'stop-live' }, () => this.trigger('stop-live'));
    this.channel.on('broadcast', { event: 'set-mode' }, (payload) => this.trigger('set-mode', payload.payload));
    this.channel.on('broadcast', { event: 'start-adhan' }, () => this.trigger('start-adhan'));
    this.channel.on('broadcast', { event: 'start-iqomah' }, (payload) => this.trigger('start-iqomah', payload.payload));
    this.channel.on('broadcast', { event: 'content-updated' }, () => this.trigger('content-updated'));

    this.channel.subscribe((status) => {
      console.log('Realtime status:', status);
      if (status === 'SUBSCRIBED') {
        this.trigger('connected');
      }
    });

    // Heartbeat setup
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat(displayCode);
    }, 15000);
  }

  disconnect() {
    if (this.channel) {
      this.channel.unsubscribe();
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }

  async sendHeartbeat(displayCode) {
    try {
      await supabase.from('displays').update({ status: 'online', updated_at: new Date() }).eq('code', displayCode);
    } catch (err) {
      console.error('Heartbeat failed', err);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, callbacks);
  }

  trigger(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(payload));
    }
  }

  // Admin commands
  async emit(displayCode, event, payload) {
    const adminChannel = supabase.channel(`display_${displayCode}`);
    adminChannel.subscribe(async (status) => {
      if(status === 'SUBSCRIBED') {
        await adminChannel.send({
          type: 'broadcast',
          event: event,
          payload: payload
        });
        supabase.removeChannel(adminChannel);
      }
    });
  }
}

export const socketService = new SocketService();
