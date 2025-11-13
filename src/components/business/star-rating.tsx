import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  totalStars?: number;
  className?: string;
  size?: number;
  showLabel?: boolean;
};

export function StarRating({ rating, totalStars = 5, className, size = 16, showLabel = false }: StarRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-0.5">
        {[...Array(totalStars)].map((_, i) => {
          const starValue = i + 1;
          return (
            <Star
              key={i}
              size={size}
              className={cn(
                'transition-colors',
                starValue <= roundedRating
                  ? 'text-primary'
                  : 'text-muted-foreground/30'
              )}
              fill={starValue <= roundedRating ? 'currentColor' : 'transparent'}
            />
          );
        })}
      </div>
      {showLabel && <span className="text-sm text-muted-foreground font-medium">{rating.toFixed(1)}</span>}
    </div>
  );
}
