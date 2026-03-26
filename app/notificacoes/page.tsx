'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Bell, Clock, Calendar, CheckCircle, AlertCircle, Trash2, Check } from 'lucide-react';

interface Notification {
  id: string;
  type: 'prazo' | 'audiencia' | 'pagamento' | 'tarefa' | 'info';
  title: string;
  message: string;
  link?: string;
  date: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function NotificacoesPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'prazo',
      title: 'Prazo Processual Urgente',
      message: 'Prazo para recurso vence em 2 dias - Processo 0001234-56.2024.8.26.0100',
      link: '/processos',
      date: new Date().toISOString(),
      read: false,
      priority: 'high',
    },
    {
      id: '2',
      type: 'audiencia',
      title: 'Audiência Agendada',
      message: 'Audiência de conciliação amanhã às 14:00 - Fórum Trabalhista',
      link: '/audiencias',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'high',
    },
    {
      id: '3',
      type: 'pagamento',
      title: 'Pagamento Recebido',
      message: 'Honorários de R$ 5.000,00 recebidos - Cliente João Silva',
      link: '/financeiro',
      date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'medium',
    },
    {
      id: '4',
      type: 'tarefa',
      title: 'Tarefa Pendente',
      message: 'Revisar petição inicial - Prazo: Hoje às 18:00',
      link: '/agenda',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'medium',
    },
    {
      id: '5',
      type: 'info',
      title: 'Novo Cliente Cadastrado',
      message: 'Maria Santos foi cadastrada no sistema',
      link: '/clientes',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'low',
    },
    {
      id: '6',
      type: 'prazo',
      title: 'Prazo Processual',
      message: 'Prazo para contestação vence em 5 dias - Processo 0002345-67.2024',
      link: '/processos',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'medium',
    },
  ]);

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Alta</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Média</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Baixa</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return date.toLocaleDateString('pt-BR');
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

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notificações</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Check className="w-5 h-5" />
              Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Não lidas ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'read'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Lidas ({notifications.length - unreadCount})
          </button>
        </div>

        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
              <p className="text-gray-500 dark:text-gray-400">Nenhuma notificação encontrada</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 ${
                  notification.priority === 'high'
                    ? 'border-red-500'
                    : notification.priority === 'medium'
                    ? 'border-yellow-500'
                    : 'border-gray-300 dark:border-gray-600'
                } ${!notification.read ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-lg font-semibold ${
                            !notification.read
                              ? 'text-gray-900 dark:text-gray-100'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-cyan-500 text-white">
                              Nova
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(notification.priority)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(notification.date)}
                      </span>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                          >
                            Marcar como lida
                          </button>
                        )}
                        {notification.link && (
                          <a
                            href={notification.link}
                            className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                          >
                            Ver detalhes
                          </a>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
