'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Users, Scale, Calendar, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'cliente' | 'processo' | 'contrato' | 'agenda' | 'financeiro' | 'outro';
  href: string;
}

export default function GlobalSearch() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const mockData: SearchResult[] = [
    { id: '1', title: 'João Silva', subtitle: 'Cliente - (11) 98765-4321', type: 'cliente', href: '/clientes' },
    { id: '2', title: 'Processo 0001234-56.2024', subtitle: 'Ação Trabalhista', type: 'processo', href: '/processos' },
    { id: '3', title: 'Contrato de Prestação de Serviços', subtitle: 'Maria Santos', type: 'contrato', href: '/contratos' },
    { id: '4', title: 'Audiência - Conciliação', subtitle: 'Hoje às 14:00', type: 'agenda', href: '/audiencias' },
    { id: '5', title: 'Pagamento Honorários', subtitle: 'R$ 5.000,00', type: 'financeiro', href: '/financeiro' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = mockData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'cliente':
        return <Users className="w-4 h-4" />;
      case 'processo':
        return <Scale className="w-4 h-4" />;
      case 'contrato':
        return <FileText className="w-4 h-4" />;
      case 'agenda':
        return <Calendar className="w-4 h-4" />;
      case 'financeiro':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cliente':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'contrato':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'agenda':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'financeiro':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600">
        <Search className="w-4 h-4" />
        <span className="text-sm">Buscar...</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Buscar...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded">
          <span>Ctrl</span>
          <span>K</span>
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div ref={searchRef} className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar clientes, processos, contratos..."
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      index === selectedIndex ? 'bg-gray-50 dark:bg-gray-700' : ''
                    }`}
                  >
                    <div className={`p-2 rounded ${getTypeColor(result.type)}`}>
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{result.subtitle}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 capitalize">{result.type}</span>
                  </button>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p>Nenhum resultado encontrado</p>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">Digite para buscar em todo o sistema</p>
                <p className="text-xs mt-2">Clientes, Processos, Contratos, Agenda, Financeiro...</p>
              </div>
            )}

            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↑↓</kbd>
                    Navegar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Enter</kbd>
                    Selecionar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Esc</kbd>
                    Fechar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
