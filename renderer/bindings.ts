export interface Config {
    library_directory: string[];
}

export async function getConfig(): Promise<Config> {
    return {
        library_directory: [],
    };
}

export async function setConfig(config: Config): Promise<void> {}
