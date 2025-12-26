/**
 * @fileoverview 사이드바 컴포넌트 - 수학 분야 카테고리 네비게이션
 */
import { fields } from '@/data/fields';
import { useI18n } from '@/i18n';
import { stripLocaleFromPath } from '@soundblue/shared';
import { Link, useLocation } from 'react-router';
import styles from '../../styles/app.module.scss';

// Use shared utility for locale stripping
const stripLocale = stripLocaleFromPath;

export function Sidebar() {
  const { locale, localePath, t } = useI18n();
  const location = useLocation();

  const isActive = (fieldId: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === `/field/${fieldId}` || currentPath.startsWith(`/field/${fieldId}/`);
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>{t('mathFields')}</h2>
        </div>

        {fields.map((field) => (
          <Link
            key={field.id}
            to={localePath(`/field/${field.id}`)}
            className={`${styles.sidebarItem} ${isActive(field.id) ? styles.sidebarItemActive : ''}`}
          >
            <span className={styles.sidebarItemIcon}>{field.icon}</span>
            <div className={styles.sidebarItemContent}>
              <div
                className={`${styles.sidebarItemLabel} ${isActive(field.id) ? styles.sidebarItemLabelActive : ''}`}
              >
                {field.name[locale] || field.name.en}
              </div>
            </div>
            {isActive(field.id) && <div className={styles.sidebarActiveIndicator} />}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
