import { Updatable } from '@interfaces/updatable.interface';

export class Updater {
    private readonly INTERVAL = 1 * 1000;  //  ms

    private timer: NodeJS.Timer;
    private updatables: Set<Updatable>;
    private lastUpdateTime: number;

    private static instance: Updater
    public static get Instance(): Updater {
        return this.instance || (this.instance = new this());
    }

    public static Register(updatable: Updatable) {
        this.Instance.updatables.add(updatable);
    }

    public static Unregister(updatable: Updatable) {
        this.Instance.updatables.delete(updatable);
    }

    private constructor() {
        this.initialize();
    }

    private initialize() {
        this.updatables = new Set<Updatable>();
        this.lastUpdateTime = Date.now();
        this.timer = setInterval(() => this.update(), this.INTERVAL);
    }

    private update(): void {
        const now = Date.now();
        const delta = now - this.lastUpdateTime;
        this.updatables?.forEach(updatable => {
            updatable?.update(delta);
        });
        this.lastUpdateTime = now;
    }
}
