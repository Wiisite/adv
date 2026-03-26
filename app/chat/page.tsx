'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Send, Search, MoreVertical, Paperclip, Smile, Users, User } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  online: boolean;
  isGroup: boolean;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const chats: Chat[] = [
    {
      id: '1',
      name: 'Dr. Pedro Santos',
      lastMessage: 'Preciso revisar aquele contrato',
      timestamp: '14:30',
      unread: 2,
      avatar: 'PS',
      online: true,
      isGroup: false,
    },
    {
      id: '2',
      name: 'Equipe Trabalhista',
      lastMessage: 'Ana: Audiência confirmada para amanhã',
      timestamp: '13:15',
      unread: 5,
      avatar: 'ET',
      online: false,
      isGroup: true,
    },
    {
      id: '3',
      name: 'Maria Silva',
      lastMessage: 'Obrigada pela ajuda!',
      timestamp: 'Ontem',
      unread: 0,
      avatar: 'MS',
      online: false,
      isGroup: false,
    },
    {
      id: '4',
      name: 'João Oliveira',
      lastMessage: 'Vou enviar os documentos',
      timestamp: 'Ontem',
      unread: 0,
      avatar: 'JO',
      online: true,
      isGroup: false,
    },
  ];

  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        sender: 'Dr. Pedro Santos',
        content: 'Bom dia! Você pode me ajudar com aquele processo?',
        timestamp: '14:25',
        isOwn: false,
      },
      {
        id: '2',
        sender: 'Você',
        content: 'Claro! Qual processo você precisa?',
        timestamp: '14:27',
        isOwn: true,
      },
      {
        id: '3',
        sender: 'Dr. Pedro Santos',
        content: 'Preciso revisar aquele contrato do cliente João Silva',
        timestamp: '14:30',
        isOwn: false,
      },
    ],
    '2': [
      {
        id: '1',
        sender: 'Ana Paula',
        content: 'Pessoal, a audiência de amanhã foi confirmada',
        timestamp: '13:15',
        isOwn: false,
      },
      {
        id: '2',
        sender: 'Carlos',
        content: 'Ótimo! Já preparei os documentos',
        timestamp: '13:20',
        isOwn: false,
      },
    ],
  };

  const currentMessages = messages[selectedChat] || [];
  const currentChat = chats.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-lg shadow flex">
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Mensagens</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                  selectedChat === chat.id ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {chat.isGroup ? <Users className="w-6 h-6" /> : chat.avatar}
                  </div>
                  {chat.online && !chat.isGroup && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full font-medium">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {currentChat.isGroup ? <Users className="w-5 h-5" /> : currentChat.avatar}
                    </div>
                    {currentChat.online && !currentChat.isGroup && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{currentChat.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentChat.online && !currentChat.isGroup ? 'Online' : currentChat.isGroup ? `${currentMessages.length} membros` : 'Offline'}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                      {!message.isOwn && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2">{message.sender}</p>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.isOwn
                            ? 'bg-cyan-500 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isOwn ? 'text-cyan-100' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Smile className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <input
                    type="text"
                    placeholder="Digite uma mensagem..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Selecione uma conversa para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
