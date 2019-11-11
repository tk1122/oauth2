export const enum DebugLevel {
    ERROR,
    INFO,
    DEBUG,
}

let currentDebugLevel: DebugLevel = DebugLevel.DEBUG;

export const setDebugLevel = (level: DebugLevel) => {
    currentDebugLevel = level;
};

export const debug = (label: string, value: any) => {
    if (currentDebugLevel >= DebugLevel.DEBUG) {
        console.log(`${label}: ${value}`);
    }
};
