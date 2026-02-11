import React from "react";
import { getReactionIcon } from "./ReactionSelector";
import type { ReactionType } from "./ReactionSelector";

interface Reaction {
    reaction_id: number;
    count: number;
}

interface ReactionIconsProps {
    reactions: Reaction[];
    totalCount: number;
    size?: "sm" | "md";
}

const ReactionIcons: React.FC<ReactionIconsProps> = ({
    reactions,
    totalCount,
    size = "md"
}) => {
    if (!reactions || reactions.length === 0) return null;

    // Sort by count (descending) and take top 3
    const topReactions = [...reactions]
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    const iconSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";
    const iconPadding = size === "sm" ? "p-0.5" : "p-1";

    return (
        <div className="flex items-center gap-1.5">
            {/* Overlapping reaction icons */}
            <div className="flex items-center">
                {topReactions.map((reaction, index) => (
                    <div
                        key={reaction.reaction_id}
                        className={`${iconSize} ${iconPadding} rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center`}
                        style={{
                            marginLeft: index > 0 ? '-8px' : '0',
                            zIndex: topReactions.length - index,
                        }}
                    >
                        <div className={size === "sm" ? "[&_svg]:w-3 [&_svg]:h-3" : "[&_svg]:w-4 [&_svg]:h-4"}>
                            {getReactionIcon(reaction.reaction_id as ReactionType)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Total count */}
            {totalCount > 0 && (
                <span className={`${size === "sm" ? "text-xs" : "text-sm"} font-medium text-gray-600`}>
                    {totalCount}
                </span>
            )}
        </div>
    );
};

export default ReactionIcons;
