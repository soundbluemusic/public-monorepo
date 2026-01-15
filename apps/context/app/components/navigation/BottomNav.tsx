import { BottomNav as BaseBottomNav, type BottomNavItem } from '@soundblue/ui/components';
import { Bookmark, Grid3X3, Home, Info, MessageCircle } from 'lucide-react';
import { useI18n } from '@/i18n';

const items: BottomNavItem[] = [
  { to: '/', icon: Home, label: 'Home', labelKo: '홈' },
  { to: '/browse', icon: Grid3X3, label: 'Browse', labelKo: '탐색' },
  { to: '/conversations', icon: MessageCircle, label: 'Talk', labelKo: '대화' },
  { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks', labelKo: '북마크' },
  { to: '/about', icon: Info, label: 'About', labelKo: '정보' },
];

export function BottomNav() {
  const { locale, localePath } = useI18n();
  return (
    <BaseBottomNav
      items={items}
      locale={locale}
      localePath={localePath}
      heightClass="h-(--bottom-nav-height)"
      hideAt="lg"
    />
  );
}
