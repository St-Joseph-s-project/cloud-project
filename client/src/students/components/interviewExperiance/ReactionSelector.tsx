import React, { useState, useRef } from "react";
import { AiFillLike, AiOutlineLike, AiFillHeart } from "react-icons/ai";
import { FaHandsClapping, FaHandHoldingHeart } from "react-icons/fa6";

export type ReactionType = 1 | 2 | 3 | 4; // 1: Like, 2: Love, 3: Clap, 4: Support

interface ReactionSelectorProps {
    currentReaction: ReactionType | null;
    reactionCount: number;
    onSelect: (reactionId: ReactionType) => void;
    isLoading?: boolean;
}

const reactions = [
    { id: 1, label: "Like", icon: <AiFillLike className="w-5 h-5 text-blue-600" /> },
    { id: 2, label: "Love", icon: <AiFillHeart className="w-5 h-5 text-red-500" /> },
    { id: 3, label: "Clap", icon: <FaHandsClapping className="w-5 h-5 text-green-600" /> },
    { id: 4, label: "Support", icon: <FaHandHoldingHeart className="w-5 h-5 text-purple-600" /> },
];

export const getReactionIcon = (reactionId: ReactionType | null) => {
    switch (reactionId) {
        case 1:
            return <AiFillLike className="w-4 h-4 text-blue-600" />;
        case 2:
            return <AiFillHeart className="w-4 h-4 text-red-500" />;
        case 3:
            return <FaHandsClapping className="w-4 h-4 text-green-600" />;
        case 4:
            return <FaHandHoldingHeart className="w-4 h-4 text-purple-600" />;
        default:
            return <AiOutlineLike className="w-4 h-4 text-gray-500" />;
    }
};

export const getReactionLabel = (reactionId: ReactionType | null) => {
    switch (reactionId) {
        case 1:
            return "Like";
        case 2:
            return "Love";
        case 3:
            return "Clap";
        case 4:
            return "Support";
        default:
            return "Like";
    }
};

export const getReactionColor = (reactionId: ReactionType | null) => {
    switch (reactionId) {
        case 1:
            return "text-blue-600 bg-blue-50";
        case 2:
            return "text-red-600 bg-red-50";
        case 3:
            return "text-green-600 bg-green-50";
        case 4:
            return "text-purple-600 bg-purple-50";
        default:
            return "text-gray-600 bg-gray-50 hover:bg-gray-100";
    }
};

const ReactionSelector: React.FC<ReactionSelectorProps> = ({
    currentReaction,
    reactionCount,
    onSelect,
    isLoading = false,
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowTooltip(false);
        }, 300); // Small delay to allow moving to popup
    };

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Tooltip Popup */}
            {showTooltip && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 px-1 py-1 flex gap-1 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {reactions.map((r) => (
                        <button
                            key={r.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(r.id as ReactionType);
                                setShowTooltip(false);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition-transform relative group/icon"
                        >
                            {r.icon}
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">
                                {r.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Main Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    // If already reacted, clicking the button removes it (or defaults to Like if generic click)
                    // But here we usually want to toggle. If already "Love", clicking main button (which shows Love) should remove it.
                    // If no reaction, clicking it defaults to "Like"
                    if (currentReaction) {
                        onSelect(currentReaction); // Parent should handle toggle logic (remove if same)
                    } else {
                        onSelect(1); // Default to Like
                    }
                }}
                disabled={isLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${getReactionColor(currentReaction)}`}
            >
                <div className="transition-transform active:scale-90">
                    {getReactionIcon(currentReaction)}
                </div>
                <span className={currentReaction ? "font-semibold" : ""}>{reactionCount || 0}</span>
            </button>
        </div>
    );
};

export default ReactionSelector;
