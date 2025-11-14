
'use client';

import { useEffect, useState, useMemo, useActionState } from 'react';
import { submitReview, type State } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

function SubmitButton() {
  const [status, setStatus] = useState<'idle' | 'executing'>('idle');
  
  useEffect(() => {
    if (status === 'executing') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);
  
  return (
    <Button type="submit" className="w-full" disabled={status === 'executing'} onClick={() => setStatus('executing')}>
      {status === 'executing' ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Review'
      )}
    </Button>
  );
}


function StarRatingInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [hoverRating, setHoverRating] = useState(0);
  const totalStars = 5;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={starValue}
            className="cursor-pointer"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                starValue <= (hoverRating || value)
                  ? "text-primary"
                  : "text-muted-foreground/30"
              )}
              fill={starValue <= (hoverRating || value) ? 'currentColor' : 'transparent'}
            />
          </button>
        );
      })}
    </div>
  );
}

export function ReviewForm({ businessId, onReviewSubmitSuccess }: { businessId: string, onReviewSubmitSuccess?: (businessId: string) => void }) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(submitReview, initialState);
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [key, setKey] = useState(Date.now().toString());

  useEffect(() => {
    if (state.message) {
        if (state.errors && Object.keys(state.errors).length > 0) {
            toast({
                title: "Error",
                description: state.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: state.message,
            });
            setRating(0);
            if(state.resetKey) {
                setKey(state.resetKey);
            }
            if (onReviewSubmitSuccess) {
              onReviewSubmitSuccess(businessId);
            }
        }
    }
  }, [state, toast, onReviewSubmitSuccess, businessId]);
  
  const formKey = useMemo(() => key, [key]);

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
        <CardDescription>Share your experience with this business.</CardDescription>
      </CardHeader>
      <CardContent>
        <form key={formKey} action={dispatch} className="space-y-6">
          <input type="hidden" name="businessId" value={businessId} />
          <input type="hidden" name="rating" value={rating} />
           <input type="hidden" name="token" value={typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : ''} />
          
          <div className="space-y-2">
            <Label htmlFor="rating" className="text-base">Your Rating</Label>
            <StarRatingInput value={rating} onChange={setRating} />
            {state.errors?.rating && <p className="text-sm font-medium text-destructive">{state.errors.rating[0]}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base">Your Review</Label>
            <Textarea id="comment" name="comment" placeholder="Tell us about your experience..." rows={4} />
            {state.errors?.comment && <p className="text-sm font-medium text-destructive">{state.errors.comment[0]}</p>}
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
