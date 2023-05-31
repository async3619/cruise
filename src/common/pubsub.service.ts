import { Injectable } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";

export type PubSubMap = Record<string, any>;
export type PubSubKeys<TMap extends PubSubMap> = Exclude<keyof TMap, symbol | number>;

@Injectable()
export class PubSubService<TMap extends PubSubMap> {
    private readonly pubSub = new PubSub();

    public publish<K extends PubSubKeys<TMap>>(key: K, payload: TMap[K]) {
        return this.pubSub.publish(key, { [key]: payload });
    }

    public subscribe<K extends PubSubKeys<TMap>>(key: K) {
        return this.pubSub.asyncIterator<TMap[K]>(key);
    }
}
