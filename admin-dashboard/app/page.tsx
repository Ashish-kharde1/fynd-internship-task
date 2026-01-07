'use client';

import { useEffect, useState } from 'react';
import DashboardStats from '../components/DashboardStats';
import ReviewsTable from '../components/ReviewsTable';
import { LayoutDashboard, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AdminPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isWakingUp, setIsWakingUp] = useState(false);

    useEffect(() => {
        checkHealthAndFetch();
    }, []);

    const checkHealthAndFetch = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // Start health check race
        const healthPromise = fetch(`${API_URL}/health`);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 2000)
        );

        try {
            // If health check takes > 2s, show granular warning
            await Promise.race([healthPromise, timeoutPromise]);
        } catch (e) {
            setIsWakingUp(true);
        }

        // Proceed to fetch real data
        fetchReviews();
    };

    const fetchReviews = async () => {
        try {
            setError(null);
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            const res = await fetch(`${API_URL}/admin/reviews`);

            if (!res.ok) throw new Error('Failed to fetch reviews');
            const data = await res.json();
            setReviews(data);
            setIsWakingUp(false); // Clear warning on success
        } catch (err) {
            console.error(err);
            setError('Could not load reviews. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchReviews();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
                    <p className="text-gray-400">Loading Dashboard...</p>
                    {isWakingUp && (
                        <p className="text-amber-600 mt-2 text-sm font-medium animate-pulse">
                            Backend is waking up... this may take up to 60s.
                        </p>
                    )}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-100">
                    <div className="text-red-500 mb-2">Error</div>
                    <p className="text-gray-900 font-medium">{error}</p>
                    <button
                        onClick={() => { setLoading(true); checkHealthAndFetch(); }}
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                    >
                        Retry
                    </button>
                    {isWakingUp && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-center gap-2 text-left max-w-xs mx-auto">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                            <p className="text-xs text-amber-800">
                                Free tier backend sleeps after inactivity. Please wait 30-60s and try again.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50/50 p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Waking Up Banner */}
                {isWakingUp && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <div>
                            <p className="text-sm font-medium text-amber-900">Backend is potentially sleeping</p>
                            <p className="text-sm text-amber-700">Expect a 30-60 second delay on the first request.</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-900 text-white rounded-lg shadow-sm">
                            <LayoutDashboard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-900 text-sm">Monitor feedback and AI insights</p>
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <section>
                    <DashboardStats reviews={reviews} />
                </section>

                {/* Table */}
                <section>
                    <ReviewsTable reviews={reviews} />
                </section>

            </div>
        </main>
    );
}
