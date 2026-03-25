'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'audiencia' | 'prazo' | 'reuniao' | 'tarefa';
  color: string;
}

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Audiência de Conciliação',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      type: 'audiencia',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      title: 'Prazo para Recurso',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '23:59',
      type: 'prazo',
      color: 'bg-red-500',
    },
    {
      id: '3',
      title: 'Reunião com Cliente',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00',
      type: 'reuniao',
      color: 'bg-green-500',
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <AppLayout>
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Calendário</h1>
            <p className="text-gray-600 dark:text-gray-400">Visualize todos os compromissos e prazos</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
            <Plus className="w-5 h-5" />
            Novo Evento
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'month'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Mês
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'week'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'day'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Dia
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 w-full">
            {weekDays.map(day => (
              <div
                key={day}
                className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[100px]" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDate(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`min-h-[100px] border border-gray-200 dark:border-gray-700 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    isToday ? 'bg-cyan-50 dark:bg-cyan-900 border-cyan-500' : ''
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`text-sm font-medium mb-1 ${
                        isToday
                          ? 'text-cyan-600 dark:text-cyan-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day}
                    </span>
                    <div className="space-y-1">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className={`${event.color} text-white text-xs px-1 py-0.5 rounded truncate`}
                          title={`${event.time} - ${event.title}`}
                        >
                          {event.time} {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Audiências</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {events.filter(e => e.type === 'audiencia').length} agendadas
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Prazos</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {events.filter(e => e.type === 'prazo').length} pendentes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Reuniões</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {events.filter(e => e.type === 'reuniao').length} marcadas
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Tarefas</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {events.filter(e => e.type === 'tarefa').length} a fazer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
