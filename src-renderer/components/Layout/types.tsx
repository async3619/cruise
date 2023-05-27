import { MinimalMusicFragment } from "@queries";

export interface LayoutMusicState {
    selectedMusics: ReadonlyArray<MinimalMusicFragment>;
    selectedIndices: ReadonlyArray<number>;
    musics: ReadonlyArray<MinimalMusicFragment> | null;
}

export interface LayoutMusicActions {
    selectMusic: (index: number | number[]) => void;
    setItems: (items: ReadonlyArray<MinimalMusicFragment>) => void;
    cancelAll(): void;
}

export interface LayoutContextValue {
    scrollView: HTMLDivElement | null;
    musics: LayoutMusicState & LayoutMusicActions;
}
