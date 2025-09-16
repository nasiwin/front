import { EventEmitter } from 'events'

export type Events = {
  'diet.changed': { userId: string; dietId: string; startedAt: string }
}

class TypedEmitter {
  private ee = new EventEmitter()

  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void) {
    this.ee.on(event as string, listener as any)
  }
  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.ee.emit(event as string, payload)
  }
}

export const events = new TypedEmitter()


