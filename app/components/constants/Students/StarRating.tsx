"use client";

import React, { useState } from "react";
import { FiStar } from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export const StarRating = ({ rating, onRatingChange, readonly = false, size = 24 }: StarRatingProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (starNumber: number) => {
    if (!readonly) {
      setHoverRating(starNumber);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleClick = (starNumber: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starNumber);
    }
  };

  const renderStar = (starNumber: number) => {
    const isActive = starNumber <= (hoverRating || rating);
    const isAnimating = !readonly && starNumber <= hoverRating && hoverRating !== rating;

    return (
      <button
        key={starNumber}
        disabled={readonly}
        onMouseEnter={() => handleMouseEnter(starNumber)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(starNumber)}
        className={`transition-all duration-200 cursor-pointer disabled:cursor-default ${
          isAnimating ? 'animate-pulse scale-110' : 'hover:scale-110'
        } ${readonly ? 'hover:scale-100' : ''}`}
        style={{ color: isActive ? '#FBBF24' : isDark ? '#475569' : '#CBD5E1' }}
      >
        <FiStar 
          size={size} 
          fill={isActive ? '#FBBF24' : 'none'}
          strokeWidth={isActive ? 0 : 2}
          className={`transition-all duration-300 ${isActive ? 'drop-shadow-lg' : ''}`}
        />
      </button>
    );
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
};