export type BaseEventMap = {
    [key: string]: (...args: any[]) => void;
};

export class EventEmitter<TEventMap extends BaseEventMap> {
    private readonly eventMap = new Map<keyof TEventMap, TEventMap[keyof TEventMap][]>();

    public on<TEvent extends keyof TEventMap>(event: TEvent, listener: TEventMap[TEvent]) {
        const listeners = this.eventMap.get(event) ?? [];
        listeners.push(listener);

        this.eventMap.set(event, listeners);
    }
    public off<TEvent extends keyof TEventMap>(event: TEvent, listener: TEventMap[TEvent]) {
        const listeners = this.eventMap.get(event) ?? [];
        const index = listeners.indexOf(listener);

        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    public emit<TEvent extends keyof TEventMap>(event: TEvent, ...args: Parameters<TEventMap[TEvent]>) {
        const listeners = this.eventMap.get(event) ?? [];

        for (const listener of listeners) {
            listener(...args);
        }
    }
}
