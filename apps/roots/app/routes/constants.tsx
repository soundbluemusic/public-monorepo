import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';
import type { MetaFunction } from 'react-router';
import styles from '../styles/app.module.scss';

const mathConstants = [
  {
    symbol: 'π',
    name: { ko: '원주율', en: 'Pi', ja: '円周率' },
    value: '3.14159265358979...',
    latex: '\\pi',
  },
  {
    symbol: 'e',
    name: { ko: '자연상수', en: "Euler's number", ja: 'ネイピア数' },
    value: '2.71828182845904...',
    latex: 'e',
  },
  {
    symbol: 'φ',
    name: { ko: '황금비', en: 'Golden ratio', ja: '黄金比' },
    value: '1.61803398874989...',
    latex: '\\varphi',
  },
  {
    symbol: '√2',
    name: { ko: '루트2', en: 'Square root of 2', ja: '√2' },
    value: '1.41421356237309...',
    latex: '\\sqrt{2}',
  },
  {
    symbol: 'γ',
    name: { ko: '오일러-마스케로니 상수', en: 'Euler–Mascheroni constant', ja: 'オイラー定数' },
    value: '0.57721566490153...',
    latex: '\\gamma',
  },
  {
    symbol: 'i',
    name: { ko: '허수 단위', en: 'Imaginary unit', ja: '虚数単位' },
    value: '√(-1)',
    latex: 'i',
  },
];

export const meta: MetaFunction = ({ location }) => {
  const locale = location.pathname.startsWith('/ko') ? 'ko' : 'en';
  const title = locale === 'ko' ? '수학 상수 - 수리' : 'Constants - Roots';
  const description = locale === 'ko' ? '수학 상수' : 'Mathematical constants';
  return [{ title }, { name: 'description', content: description }];
};

export default function ConstantsPage() {
  const { locale, t } = useI18n();

  return (
    <Layout>
      <h1 className={styles.browseTitle}>{t('constants')}</h1>

      <div className={styles.constantsGrid}>
        {mathConstants.map((constant) => (
          <div key={constant.symbol} className={styles.constantCard}>
            <div className={styles.constantSymbol}>{constant.symbol}</div>
            <h3 className={styles.constantName}>
              {constant.name[locale as keyof typeof constant.name] || constant.name.en}
            </h3>
            <p className={styles.constantValue}>{constant.value}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
