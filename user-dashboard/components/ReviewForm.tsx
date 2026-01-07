'use client';

import { useState } from 'react';
import { Star, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper to merge classes
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function ReviewForm() {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!review.trim()) {
            setError('Please write a review');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setResponse(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            const res = await fetch(`${API_URL}/submit-review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, review }),
            });

            if (!res.ok) {
                throw new Error('Failed to submit review');
            }

            const data = await res.json();
            setResponse(data.ai_response);
            setRating(0);
            setReview('');
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">We value your feedback</h2>
            <p className="text-gray-300 text-center mb-8">Tell us about your experience</p>

            {response ? (
                <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-emerald-300 mb-2">Thank You!</h3>
                    <p className="text-gray-200">{response}</p>
                    <button
                        onClick={() => setResponse(null)}
                        className="mt-6 text-sm text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
                    >
                        Submit another review
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating Selector */}
                    <div className="flex flex-col items-center space-y-2">
                        <label className="text-sm font-medium text-gray-300">Rate your experience</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        className={cn(
                                            "w-10 h-10 transition-colors duration-200",
                                            (hoverRating || rating) >= star
                                                ? "fill-yellow-400 text-yellow-400 stroke-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                                                : "text-gray-500 stroke-gray-500 hover:text-gray-400"
                                        )}
                                        strokeWidth={1.5}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Text Area */}
                    <div className="space-y-2">
                        <label htmlFor="review" className="text-sm font-medium text-gray-300">
                            Your Review
                        </label>
                        <textarea
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="What did you like or dislike?"
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <span>Submit Review</span>
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
