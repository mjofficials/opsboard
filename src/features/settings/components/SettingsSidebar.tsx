'use client';

import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, CreditCard, TriangleAlert } from 'lucide-react';

const baseNavItems = [
  { title: 'General', href: '/settings/general', icon: Settings },
];

const adminNavItems = [
  { title: 'Billing', href: '/settings/billing', icon: CreditCard },
  { title: 'Danger Zone', href: '/settings/danger-zone', icon: TriangleAlert },
];

const allNavItems = [...baseNavItems, ...adminNavItems];

interface SettingsSidebarProps {
  isAdmin: boolean;
  isOwner: boolean;
  isMember: boolean;
}

function SidebarLink({ item }: { item: typeof baseNavItems[0] }) {
  const pathname = usePathname();
  const Icon = item.icon;
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        (item.href === '/settings/danger-zone' || item.href === '/settings/billing') &&
        'text-destructive hover:text-destructive'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.title}
    </Link>
  );
}

export const SettingsSidebar = memo(function SettingsSidebar({ isAdmin, isOwner }: SettingsSidebarProps) {
  const navItems = isAdmin || isOwner ? allNavItems : baseNavItems;

  return (
    <nav className="w-48 shrink-0 space-y-1 pt-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
        Settings
      </p>
      {navItems.map((item) => (
        <SidebarLink key={item.href} item={item} />
      ))}
    </nav>
  );
});
