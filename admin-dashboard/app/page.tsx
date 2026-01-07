'use client';

import { useEffect, useState } from 'react';
import DashboardStats from '../components/DashboardStats';
import ReviewsTable from '../components/ReviewsTable';
import { LayoutDashboard } from 'lucide-react';

export default function AdminPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch('http://localhost:8000/admin/reviews');
            if (!res.ok) throw new Error('Failed to fetch reviews');
            const data = await res.json();
            setReviews(data);
        } catch (err) {
            console.error(err);
            setError('Could not load reviews. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
                    <p className="text-gray-400">Loading Dashboard...</p>
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
                        onClick={() => { setLoading(true); fetchReviews(); }}
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50/50 p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-gray-900 text-white rounded-lg shadow-sm">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-900 text-sm">Monitor feedback and AI insights</p>
                    </div>
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
