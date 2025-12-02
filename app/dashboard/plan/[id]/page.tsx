'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Loader2, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface CompliancePlan {
  id: string;
  userId: string;
  planContent: string;
  sourceData: any; // Assuming sourceData is a generic JSON object
  createdAt: string;
  updatedAt: string;
}

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plan, setPlan] = useState<CompliancePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const planId = params.id;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && planId) {
      fetchPlanDetail(planId);
    }
  }, [session, planId]);

  const fetchPlanDetail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/plans?id=${id}`); // Re-using GET /api/plans with an ID query param
      if (!response.ok) {
        throw new Error('Failed to fetch plan details');
      }
      const data = await response.json();
      // Assuming the API returns { plan: CompliancePlan } if ID is provided
      if (data.plan && data.plan.id === id) { // Ensure the correct plan is returned
        setPlan(data.plan);
      } else {
        setError('Plan not found or unauthorized access.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching plan details');
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

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-xl rounded-xl my-8">
        <p className="text-red-600 text-lg">{error}</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  if (loading || !plan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading plan details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-xl rounded-xl my-8 border border-gray-100">
      <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Compliance Plan Details</h1>
      <p className="text-sm text-gray-500 mb-4">
        Saved on {plan.createdAt ? format(new Date(plan.createdAt), 'MMM dd, yyyy - hh:mm a') : 'N/A'}
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Generated Plan:</h2>
        <div className="prose prose-blue max-w-none border rounded-md p-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {plan.planContent}
          </ReactMarkdown>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Source Data (Questionnaire Input):</h2>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
          <code>{JSON.stringify(plan.sourceData, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
