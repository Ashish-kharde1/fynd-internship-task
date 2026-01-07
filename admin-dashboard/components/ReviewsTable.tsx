import { Star, Bot, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Review {
    id: number;
    rating: number;
    review: string;
    ai_summary?: string;
    ai_recommended_action?: string;
    created_at: string;
}

interface ReviewsTableProps {
    reviews: Review[];
}

export default function ReviewsTable({ reviews }: ReviewsTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4 w-1/3">Customer Review</th>
                            <th className="px-6 py-4 w-1/4">
                                <div className="flex items-center gap-1">
                                    <Bot className="w-3.5 h-3.5" />
                                    AI Summary
                                </div>
                            </th>
                            <th className="px-6 py-4 w-1/4">
                                <div className="flex items-center gap-1">
                                    <Zap className="w-3.5 h-3.5" />
                                    Recommended Action
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    No reviews found yet.
                                </td>
                            </tr>
                        ) : (
                            reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold text-gray-900">{review.rating}</span>
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="line-clamp-2 text-gray-900">{review.review}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {review.ai_summary ? (
                                            <span className="inline-block bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-md border border-purple-100">
                                                {review.ai_summary}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">Processing...</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {review.ai_recommended_action ? (
                                            <div className={`text-xs p-3 rounded-lg border ${review.rating < 3
                                                    ? 'bg-red-50 text-red-800 border-red-100 prose-red'
                                                    : 'bg-blue-50 text-blue-800 border-blue-100 prose-blue'
                                                }`}>
                                                <div className="prose prose-xs max-w-none">
                                                    <ReactMarkdown
                                                        components={{
                                                            ul: ({ children }) => <ul className="list-disc pl-4 m-0">{children}</ul>,
                                                            li: ({ children }) => <li className="m-0">{children}</li>,
                                                            p: ({ children }) => <p className="m-0 mb-1 last:mb-0">{children}</p>
                                                        }}
                                                    >
                                                        {review.ai_recommended_action}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
