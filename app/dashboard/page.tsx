'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, FileText, Loader2, RefreshCcw } from 'lucide-react';

interface CompliancePlan {
  id: string;
  userId: string;
  planContent: string;
  sourceData: any; // Can be more specific if schema is known
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<CompliancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchPlans();
    }
  }, [session]);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/plans');
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      const data = await response.json();
      setPlans(data.plans);
    } catch (err: any) {
      setError(err.message || 'Error fetching plans');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
        <button
          onClick={fetchPlans}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading && plans.length === 0 && (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <p className="ml-2 text-gray-600">Loading plans...</p>
        </div>
      )}

      {!loading && plans.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-white">
          <p className="text-gray-600 text-lg mb-4">No compliance plans saved yet.</p>
          <Link
            href="/questionnaire"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-medium"
          >
            Generate Your First Plan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((planItem) => (
          <div key={planItem.id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Compliance Plan
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Saved on {format(new Date(planItem.createdAt), 'MMM dd, yyyy - hh:mm a')}
            </p>
            <p className="text-gray-700 mt-4 line-clamp-3">{planItem.planContent}</p>
            <div className="mt-4 flex justify-between items-center">
              <Link href={`/dashboard/plan/${planItem.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                View Details
              </Link>
              {/* Add Download/Share actions here if needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
