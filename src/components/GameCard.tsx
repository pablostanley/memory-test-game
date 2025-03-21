import { Card } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";

interface GameCardProps {
    card: Card;
    onClick: (id: number) => void;
    disabled: boolean;
}

export default function GameCard({ card, onClick, disabled }: GameCardProps) {
    const handleClick = () => {
        if (!disabled && !card.isFlipped && !card.isMatched) {
            onClick(card.id);
        }
    };

    return (
        <div className="relative w-full aspect-square">
            <motion.div
                className="w-full h-full relative cursor-pointer"
                onClick={handleClick}
                initial={false}
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                }}
            >
                {/* Card Back */}
                <motion.div
                    className="absolute w-full h-full flex items-center justify-center rounded-lg bg-primary-foreground shadow-md"
                    style={{
                        backfaceVisibility: "hidden",
                        zIndex: card.isFlipped || card.isMatched ? 0 : 1,
                    }}
                >
                    <div className="text-4xl font-bold text-primary">?</div>
                </motion.div>

                {/* Card Front */}
                <motion.div
                    className={`absolute w-full h-full flex items-center justify-center rounded-lg ${card.isMatched ? "bg-green-100" : "bg-white"
                        } shadow-md`}
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        zIndex: card.isFlipped || card.isMatched ? 1 : 0,
                    }}
                >
                    <div className="relative w-full h-full p-2">
                        <Image
                            src={card.imageUrl}
                            alt="Card"
                            fill
                            className="object-contain rounded-lg"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
} 