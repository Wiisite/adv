'use client';

import { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, Calendar, Scale, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: 'prazo' | 'audiencia' | 'pagamento' | 'tarefa' | 'info';
  title: string;
  message: string;
  link?: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function NotificationPanel() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'prazo',
      title: 'Prazo Processual',
      message: 'Prazo para recurso vence em 2 dias - Processo 0001234-56.2024',
      link: '/processos',
      time: 'Há 1 hora',
      read: false,
      priority: 'high',
    },
    {
      id: '2',
      type: 'audiencia',
      title: 'Audiência Agendada',
      message: 'Audiência de conciliação amanhã às 14:00',
      link: '/audiencias',
      time: 'Há 2 horas',
      read: false,
      priority: 'high',
    },
    {
      id: '3',
      type: 'pagamento',
      title: 'Pagamento Recebido',
      message: 'Honorários de R$ 5.000,00 recebidos - Cliente João Silva',
      link: '/financeiro',
      time: 'Há 3 horas',
      read: false,
      priority: 'medium',
    },
    {
      id: '4',
      type: 'tarefa',
      title: 'Tarefa Pendente',
      message: 'Revisar petição inicial - Prazo: Hoje',
      link: '/agenda',
      time: 'Há 5 horas',
      read: true,
      priority: 'medium',
    },
    {
      id: '5',
      type: 'info',
      title: 'Novo Cliente',
      message: 'Maria Santos foi cadastrada no sistema',
      link: '/clientes',
      time: 'Ontem',
      read: true,
      priority: 'low',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'prazo':
        return <Clock className="w-5 h-5 text-red-500" />;
      case 'audiencia':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'pagamento':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'tarefa':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-40 max-h-[600px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notificações</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    Marcar todas como lidas
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''
                      } ${getPriorityColor(notification.priority)}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-gray-100' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              <X className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.time}
                            </span>
                            {!notification.read && (
                              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                                Nova
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={() => {
                  router.push('/notificacoes');
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Ver todas as notificações
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
