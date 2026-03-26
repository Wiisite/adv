'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  FolderOpen,
  DollarSign,
  FileText,
  Calendar,
  FileCheck,
  Scale,
  Gavel,
  Briefcase,
  ClipboardList,
  UserCheck,
  Award,
  Globe,
  Building,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  label: string;
  icon: any;
  href?: string;
  submenu?: { label: string; href: string }[];
}

export default function AppSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    
    {
      label: 'Pessoas',
      icon: Users,
      submenu: [
        { label: 'Clientes', href: '/clientes' },
        { label: 'Usuários', href: '/usuarios' },
        { label: 'Profissionais', href: '/profissionais' },
        { label: 'Fornecedores', href: '/fornecedores' },
      ]
    },
    
    {
      label: 'Processos',
      icon: Gavel,
      submenu: [
        { label: 'Todos os Processos', href: '/processos' },
        { label: 'Em Andamento', href: '/processos-andamento' },
        { label: 'Casos Solicitados', href: '/casos-solicitados' },
        { label: 'Integração Tribunais', href: '/integracao-tribunais' },
      ]
    },
    
    {
      label: 'Agenda',
      icon: Calendar,
      submenu: [
        { label: 'Calendário', href: '/calendario' },
        { label: 'Tarefas / Agenda', href: '/agenda' },
        { label: 'Audiências', href: '/audiencias' },
        { label: 'Perícias', href: '/pericias' },
      ]
    },
    
    {
      label: 'Contratos',
      icon: FileCheck,
      submenu: [
        { label: 'Abertura de Contratos', href: '/contratos' },
        { label: 'Gerar Contrato', href: '/gerar-contrato' },
      ]
    },
    
    {
      label: 'Documentos',
      icon: FolderOpen,
      submenu: [
        { label: 'Arquivos', href: '/documentos' },
        { label: 'Gestão de Documentos', href: '/gestao-documentos' },
      ]
    },
    
    {
      label: 'Financeiro',
      icon: DollarSign,
      submenu: [
        { label: 'Visão Geral', href: '/financeiro' },
        { label: 'Contas a Pagar', href: '/contas-pagar' },
        { label: 'Contas a Receber', href: '/contas-receber' },
        { label: 'Caixas', href: '/caixas' },
        { label: 'Controle de Horas', href: '/timesheet' },
      ]
    },
    
    {
      label: 'Comunicação',
      icon: FileText,
      submenu: [
        { label: 'Email/WhatsApp/SMS', href: '/comunicacao' },
        { label: 'Chat Interno', href: '/chat' },
      ]
    },
    
    { label: 'Assistente IA', icon: FileText, href: '/assistente-ia' },
    { label: 'Anotações', icon: FileText, href: '/anotacoes' },
    { label: 'Benefícios / OCB', icon: Award, href: '/beneficios' },
    
    {
      label: 'Cadastros',
      icon: Building,
      submenu: [
        { label: 'Prompts', href: '/cadastros/prompts' },
        { label: 'Formas Pgto', href: '/cadastros/formas-pgto' },
        { label: 'Frequências', href: '/cadastros/frequencias' },
        { label: 'Cargos', href: '/cadastros/cargos' },
        { label: 'Serviços Prestados', href: '/cadastros/servicos' },
        { label: 'Modelos de Contratos', href: '/cadastros/modelos-contratos' },
        { label: 'Grupos', href: '/cadastros/grupos' },
        { label: 'Assuntos', href: '/cadastros/assuntos' },
      ]
    },
    
    {
      label: 'Gestão',
      icon: TrendingUp,
      submenu: [
        { label: 'RH', href: '/rh' },
        { label: 'Marketing', href: '/marketing' },
        { label: 'Site', href: '/site' },
      ]
    },
    
    { label: 'Relatórios', icon: FileText, href: '/relatorios' },
    
    {
      label: 'Sistema',
      icon: Building,
      submenu: [
        { label: 'Configurações', href: '/configuracoes' },
        { label: 'LGPD/Compliance', href: '/lgpd' },
        { label: 'Logs do Sistema', href: '/logs' },
        { label: 'Ajuda', href: '/ajuda' },
      ]
    },
  ];

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="fixed left-0 top-0 w-64 bg-gray-900 dark:bg-gray-950 text-white h-screen overflow-y-auto z-20">
      <div className="p-4 border-b border-gray-800 dark:border-gray-700">
        <h1 className="text-xl font-bold text-cyan-400">Sistema Advocacia</h1>
      </div>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {openMenus.includes(item.label) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {openMenus.includes(item.label) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`block px-3 py-2 rounded text-sm transition-colors ${
                          isActive(subItem.href)
                            ? 'bg-cyan-600 text-white'
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href!}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                  isActive(item.href!)
                    ? 'bg-cyan-600 text-white'
                    : 'hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
