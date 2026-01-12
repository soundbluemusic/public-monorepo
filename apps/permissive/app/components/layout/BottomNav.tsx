import { BottomNav as BaseBottomNav, type BottomNavItem } from '@soundblue/ui/components';
import { Globe, Home, Package } from 'lucide-react';
import { useI18n } from '../../i18n';

const items: BottomNavItem[] = [
  { to: '/', icon: Home, label: 'Home', labelKo: '홈' },
  { to: '/web-api', icon: Globe, label: 'Web API', labelKo: 'Web API' },
  { to: '/libraries', icon: Package, label: 'Libraries', labelKo: 'Libraries' },
];

export default function BottomNav() {
  const { locale, localePath } = useI18n();
  return <BaseBottomNav items={items} locale={locale} localePath={localePath} hideAt="lg" />;
}
