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

  useEffect(() => {
    // Get department info from localStorage
    const depUserId = localStorage.getItem('departmentUserId');
    const depId = localStorage.getItem('departmentId');
    
    if (!depUserId || !depId) {
      // Redirect to login if no credentials
      router.push('/login');
      return;
    }
    
    setDepartmentUserId(depUserId);
    setDepartmentId(parseInt(depId));
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading chat...</div>
      </div>
    );
  }

  if (!disasterId || !departmentUserId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-600">Invalid chat session</div>
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
