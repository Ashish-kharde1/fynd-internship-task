import { BarChart3, TrendingUp } from 'lucide-react';

interface StatsProps {
    reviews: any[];
}

export default function DashboardStats({ reviews }: StatsProps) {
    // Simple insight: Today vs Total
    const total = reviews.length;
    const today = new Date().toISOString().split('T')[0];
    const todayCount = reviews.filter((r) => r.created_at.startsWith(today)).length;

    // Calculate percentage for progress bar (capped at 100% for visuals if todayCount is huge relative to total, though mathematically impossible to exceed total)
    const percentage = total > 0 ? (todayCount / total) * 100 : 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Submission Insight</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">Today vs Total</h3>
                </div>
            </div>

            <div className="flex-1 w-full md:max-w-md">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-bold text-gray-900">{todayCount} <span className="text-base font-normal text-gray-500">today</span></span>
                    <span className="text-sm font-medium text-gray-500">from {total} total</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }} // Minimum 5% width for visibility
                    ></div>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500 gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 font-medium">Live updates</span>
                    <span>based on current data</span>
                </div>
            </div>
        </div>
    );
}
