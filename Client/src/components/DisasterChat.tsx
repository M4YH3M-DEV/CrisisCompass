"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Message {
  _id: string;
  text: string;
  userId: string;
  userName: string;
  departmentId: number;
  timestamp: string;
}

interface Member {
  _id: string;
  userId: string;
  userName: string;
  departmentId: number;
  isActive: boolean;
}

interface DisasterChatProps {
  disasterId: string;
  departmentUserId: string;
  departmentId: number;
}

const DisasterChat: React.FC<DisasterChatProps> = ({
  disasterId,
  departmentUserId,
  departmentId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/${disasterId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch members
  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/chat/${disasterId}/members`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchMembers();

    // Set up polling for real-time updates (every 2 seconds)
    const interval = setInterval(() => {
      fetchMessages();
      fetchMembers();
    }, 2000);

    return () => clearInterval(interval);
  }, [disasterId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/chat/${disasterId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newMessage.trim(),
          userId: departmentUserId,
          departmentId: departmentId,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh messages
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHomeNavigation = () => {
    // Clear authentication data
    localStorage.removeItem("departmentUserId");
    localStorage.removeItem("departmentId");
    localStorage.removeItem("loginCredentials");

    // Navigate to home
    router.push("/");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout? This will end your chat session."
    );

    if (confirmLogout) {
      handleHomeNavigation();
    }
  };

  return (
    <div className="min-h-screen max-h-screen bg-black font-mono text-green-400 flex">
      {/* Members Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-green-600 p-4">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-green-400 mb-2">
            {">"} ACTIVE_MEMBERS
          </h3>
          <div className="text-green-300 text-sm mb-4">
            // Connected departments: {members.length}
          </div>
        </div>

        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member._id}
              className={`border rounded p-3 text-sm transition-colors duration-200 ${
                member.userId === departmentUserId
                  ? "bg-green-900 bg-opacity-30 border-green-400 text-green-300"
                  : "bg-gray-800 border-green-700 text-green-400 hover:border-green-500"
              }`}
            >
              <div className="font-bold text-green-300 mb-1">
                {member.userName}
              </div>
              <div className="text-green-600 text-xs">
                {">"} DEPT_ID: {member.departmentId}
              </div>
              <div className="text-green-600 text-xs">
                {">"} USER_ID: {member.userId}
              </div>
              {member.userId === departmentUserId && (
                <div className="text-green-400 text-xs mt-1 font-bold">
                  // YOU
                </div>
              )}
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center text-green-600 text-sm mt-8">
            {">"} No active members
            <br />
            // Waiting for connections...
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-green-600 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-1">
                {">"} DISASTER_RESPONSE_CHAT
              </h2>
              <div className="text-green-300 text-sm">
                // DISASTER_ID: {disasterId.slice(-8).toUpperCase()}
              </div>
              <div className="text-green-300 text-sm">
                // LOGGED_AS: DEPT_{departmentId}
              </div>
            </div>

            <div className="flex space-x-3">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-bold rounded bg-gray-800 text-red-400 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                LOGOUT
              </button>

              {/* Home Button */}
              <button
                onClick={handleHomeNavigation}
                className="inline-flex items-center px-4 py-2 border border-green-600 text-sm font-bold rounded bg-gray-800 text-green-400 hover:bg-green-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                HOME
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
          {messages.length === 0 && (
            <div className="text-center text-green-600 mt-8">
              <div className="text-lg mb-2">{">"} Chat initialized</div>
              <div className="text-sm">
                // No messages yet. Start the conversation.
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.userId === departmentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded border transition-colors duration-200 ${
                  message.userId === departmentUserId
                    ? "bg-green-900 bg-opacity-30 border-green-500 text-green-300"
                    : "bg-gray-900 border-green-700 text-green-400"
                }`}
              >
                <div className="text-xs text-green-600 mb-2 font-mono">
                  {">"} {message.userName} | DEPT_{message.departmentId}
                  {message.userId === departmentUserId && (
                    <span className="text-green-400 ml-2">// YOU</span>
                  )}
                </div>
                <div className="text-green-300 mb-2 break-words">
                  {message.text}
                </div>
                <div className="text-xs text-green-600 font-mono">
                  // {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-gray-900 border-t border-green-600 p-4">
          <form onSubmit={sendMessage} className="space-y-3">
            <div className="text-green-300 text-sm">{">"} COMPOSE_MESSAGE:</div>
            <div className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-black border border-green-600 text-green-400 px-4 py-3 rounded focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500 placeholder-green-600 font-mono"
                disabled={loading}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="bg-green-600 text-black px-6 py-3 rounded font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[100px]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    SEND
                  </div>
                ) : (
                  "SEND"
                )}
              </button>
            </div>
            <div className="text-green-600 text-xs">
              // {newMessage.length}/500 characters | ENTER to send
            </div>
          </form>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-800 border-t border-green-700 px-4 py-2">
          <div className="text-green-600 text-xs font-mono">
            // STATUS: ONLINE | MEMBERS: {members.length} | MESSAGES:{" "}
            {messages.length} | LAST_UPDATE: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterChat;
