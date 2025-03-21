import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchRandomIllustrations } from "@/lib/api";
import { Card, GameState } from "@/lib/types";
import GameCard from "./GameCard";
import { Button } from "./ui/button";

// Hearts for lives
const Heart = ({ filled }: { filled: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={filled ? "red" : "none"}
        stroke={filled ? "red" : "currentColor"}
        className="w-6 h-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
    </svg>
);

const initialGameState: GameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    lives: 6,
    gameStarted: false,
    gameOver: false,
    isLoading: false,
};

export default function MemoryGame() {
    const [gameState, setGameState] = useState<GameState>(initialGameState);

    // Initialize or restart the game
    const startGame = async () => {
        setGameState((prev) => ({ ...prev, isLoading: true }));

        try {
            // Fetch 8 random illustrations
            const images = await fetchRandomIllustrations(8);

            // Create the card pairs and shuffle
            const cardPairs = [...images, ...images].map((imageUrl, index) => ({
                id: index,
                imageUrl,
                isFlipped: false,
                isMatched: false,
            }));

            // Fisher-Yates shuffle algorithm
            const shuffledCards = [...cardPairs];
            for (let i = shuffledCards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
            }

            setGameState({
                ...initialGameState,
                cards: shuffledCards,
                gameStarted: true,
                isLoading: false,
            });
        } catch (error) {
            console.error("Error starting game:", error);
            setGameState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    // Handle card flip
    const handleCardClick = (id: number) => {
        if (gameState.flippedCards.length === 2) return; // Already have 2 cards flipped

        const newCards = gameState.cards.map((card) =>
            card.id === id ? { ...card, isFlipped: true } : card
        );

        const newFlippedCards = [...gameState.flippedCards, id];

        setGameState((prev) => ({
            ...prev,
            cards: newCards,
            flippedCards: newFlippedCards,
        }));

        // Check for a match if two cards are flipped
        if (newFlippedCards.length === 2) {
            const [firstId, secondId] = newFlippedCards;
            const firstCard = newCards.find((card) => card.id === firstId);
            const secondCard = newCards.find((card) => card.id === secondId);

            // Check if the two cards match
            if (firstCard?.imageUrl === secondCard?.imageUrl) {
                // Match found
                setTimeout(() => {
                    const matchedCards = newCards.map((card) =>
                        card.id === firstId || card.id === secondId
                            ? { ...card, isMatched: true, isFlipped: false }
                            : card
                    );

                    const newMatchedPairs = gameState.matchedPairs + 1;
                    const gameWon = newMatchedPairs === 8; // All pairs matched

                    setGameState((prev) => ({
                        ...prev,
                        cards: matchedCards,
                        flippedCards: [],
                        matchedPairs: newMatchedPairs,
                        gameOver: gameWon,
                    }));
                }, 1000);
            } else {
                // No match
                setTimeout(() => {
                    const updatedCards = newCards.map((card) =>
                        card.id === firstId || card.id === secondId
                            ? { ...card, isFlipped: false }
                            : card
                    );

                    const newLives = gameState.lives - 1;
                    const gameLost = newLives <= 0;

                    setGameState((prev) => ({
                        ...prev,
                        cards: updatedCards,
                        flippedCards: [],
                        lives: newLives,
                        gameOver: gameLost,
                    }));
                }, 1000);
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {!gameState.gameStarted ? (
                <div className="flex flex-col items-center justify-center space-y-6 py-12">
                    <motion.h1
                        className="text-4xl font-bold text-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Memory Game
                    </motion.h1>
                    <motion.p
                        className="text-center text-gray-600 max-w-md"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Test your memory by matching pairs of cards. You have 6 lives!
                    </motion.p>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <Button
                            onClick={startGame}
                            size="lg"
                            disabled={gameState.isLoading}
                            className="text-lg px-8 py-6"
                        >
                            {gameState.isLoading ? "Loading..." : "Start Game"}
                        </Button>
                    </motion.div>
                </div>
            ) : (
                <div className="p-4">
                    {/* Game header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-1">
                            {Array.from({ length: 6 }, (_, i) => (
                                <Heart key={i} filled={i < gameState.lives} />
                            ))}
                        </div>
                        <Button
                            onClick={startGame}
                            variant="outline"
                            disabled={gameState.isLoading}
                        >
                            Restart
                        </Button>
                    </div>

                    {/* Game over message */}
                    {gameState.gameOver && (
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center bg-black/60 z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="bg-white p-8 rounded-lg text-center shadow-xl"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold mb-4">
                                    {gameState.lives > 0 ? "You Won! 🎉" : "Game Over 😭"}
                                </h2>
                                <p className="mb-6">
                                    {gameState.lives > 0
                                        ? `Congratulations! You found all pairs with ${gameState.lives} lives remaining!`
                                        : "You ran out of lives. Try again!"}
                                </p>
                                <Button onClick={startGame} size="lg">
                                    Play Again
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Game board */}
                    <div className="grid grid-cols-4 gap-4">
                        {gameState.cards.map((card) => (
                            <GameCard
                                key={card.id}
                                card={card}
                                onClick={handleCardClick}
                                disabled={
                                    gameState.flippedCards.length === 2 ||
                                    gameState.gameOver ||
                                    card.isMatched
                                }
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 