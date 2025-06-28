"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DisasterChat from '../../components/DisasterChat';

const ChatPage = () => {
  const params = useParams();
  const router = useRouter();
  
  const disasterId = params.disasterId as string;
  
  const [departmentUserId, setDepartmentUserId] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication on component mount
    const checkAuth = () => {
      const depUserId = localStorage.getItem('departmentUserId');
      const depId = localStorage.getItem('departmentId');
      
      if (!depUserId || !depId) {
        // No credentials found, redirect to home
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      // Valid credentials found
      setDepartmentUserId(depUserId);
      setDepartmentId(parseInt(depId));
      setIsAuthenticated(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Loading state with terminal theme
  if (loading) {
    return (
      <div className="min-h-screen bg-black font-mono text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">{">"} INITIALIZING_CHAT...</div>
          <div className="text-green-600 text-sm">// Verifying credentials</div>
          <div className="animate-pulse mt-4">
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Authentication failed state
  if (!isAuthenticated || !disasterId || !departmentUserId) {
    return (
      <div className="min-h-screen bg-black font-mono text-green-400 flex items-center justify-center">
        <div className="text-center border border-red-600 bg-red-900 bg-opacity-20 p-8 rounded">
          <div className="text-2xl text-red-400 mb-4">{">"} ACCESS_DENIED</div>
          <div className="text-red-300 text-sm mb-4">
            // Authentication required to access chat
          </div>
          <div className="text-green-600 text-xs mb-6">
            ERROR: Invalid or missing credentials
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-black px-6 py-2 rounded font-bold hover:bg-green-700 transition-colors duration-200"
          >
            RETURN_HOME
          </button>
        </div>
      </div>
    );
  }

  return (
    <DisasterChat
      disasterId={disasterId}
      departmentUserId={departmentUserId}
      departmentId={departmentId}
    />
  );
};

export default ChatPage;
