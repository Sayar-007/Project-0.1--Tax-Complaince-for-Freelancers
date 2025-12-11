'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <Link href="/" className="text-xl font-bold text-blue-600">
        ComplianceAlpha
      </Link>
      <div className="flex gap-4">
        {session ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 self-center"
            >
              Dashboard
            </Link>
            <span className="text-sm text-gray-700 self-center">
              Hi, {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
