import { createContext, ReactNode, useState, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    playNext: () => void;
    playPrevius: () => void;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    isShuffling: boolean;
    clearPlayerState: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIslooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }
    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }
    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext() {

        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }


    }
    function playPrevius() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }
    function toggleLoop() {
        setIslooping(!isLooping);
    }
    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }
    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                play,
                isPlaying,
                togglePlay,
                setPlayingState,
                playList,
                playNext,
                playPrevius,
                hasNext,
                hasPrevious,
                isLooping,
                toggleLoop,
                toggleShuffle,
                isShuffling,
                clearPlayerState
            }}>
            {children}
        </PlayerContext.Provider>)
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}