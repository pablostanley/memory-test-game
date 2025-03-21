export interface Card {
    id: number;
    imageUrl: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface GameState {
    cards: Card[];
    flippedCards: number[];
    matchedPairs: number;
    lives: number;
    gameStarted: boolean;
    gameOver: boolean;
    isLoading: boolean;
} 