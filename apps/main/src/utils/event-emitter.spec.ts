import { EventEmitter } from "@utils/event-emitter";

describe("EventEmitter class", () => {
    let emitter: EventEmitter<{ event: (arg: string) => void; test: () => void }>;

    beforeEach(() => {
        emitter = new EventEmitter();
    });

    it("should be defined", () => {
        expect(emitter).toBeDefined();
    });

    it("should able to add listener", () => {
        const listener = jest.fn();
        emitter.on("event", listener);

        expect(emitter["eventMap"].get("event")).toEqual([listener]);
    });

    it("should able to remove listener", () => {
        const listener = jest.fn();
        emitter.on("event", listener);
        emitter.off("event", listener);

        expect(emitter["eventMap"].get("event")).toEqual([]);

        // Remove non-exist listener should not throw error
        emitter.off("test", listener);

        expect(emitter["eventMap"].get("test")).toEqual(undefined);
    });

    it("should able to emit event", () => {
        const listener = jest.fn();
        emitter.on("event", listener);
        emitter["emit"]("event", "test");

        expect(listener).toBeCalledWith("test");

        // Emit non-exist event should not throw error
        expect(() => emitter["emit"]("test")).not.toThrow();
    });
});
