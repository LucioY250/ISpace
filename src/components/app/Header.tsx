'use client';

import type {FC} from 'react';
import {Button} from '@/components/ui/button';
import {Download} from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
}

const Header: FC<HeaderProps> = ({onExport}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 h-16 shrink-0">
      <h1 className="text-2xl font-bold font-headline text-foreground">ISpace</h1>
      <Button onClick={onExport} variant="default" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </header>
  );
};

export default Header;
