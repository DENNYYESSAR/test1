
'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    createdAt: any;
}

interface ChatInterfaceProps {
    chatId: string;
    recipientName: string;
}

export default function ChatInterface({ chatId, recipientName }: ChatInterfaceProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chatId) return;

        const q = query(
            collection(db, `chats/${chatId}/messages`),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            setMessages(msgs);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await addDoc(collection(db, `chats/${chatId}/messages`), {
                text: newMessage,
                senderId: user.uid,
                senderName: user.displayName || user.email?.split('@')[0] || 'User',
                createdAt: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="ri-user-md-line text-xl"></i>
                    </div>
                    <div>
                        <h3 className="font-bold">{recipientName}</h3>
                        <div className="flex items-center text-xs text-blue-100">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            Online
                        </div>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <i className="ri-more-2-fill text-xl"></i>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                        <i className="ri-message-3-line text-4xl mb-2"></i>
                        <p>Start the conversation</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === user?.uid;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${isMe
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                    }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {msg.createdAt?.seconds
                                            ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : 'Sending...'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center space-x-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <i className="ri-attachment-2 text-xl"></i>
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform active:scale-95"
                    >
                        <i className="ri-send-plane-fill text-xl"></i>
                    </button>
                </div>
            </form>
        </div>
    );
}
