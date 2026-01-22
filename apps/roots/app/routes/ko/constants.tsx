import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '../../components/layout/Layout';
import { useI18n } from '../../i18n';

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

export const Route = createFileRoute('/ko/constants')({
  head: headFactoryKo(
    {
      ko: { title: '수학 상수 - 수리', description: '수학 상수' },
      en: { title: 'Constants - Roots', description: 'Mathematical constants' },
    },
    'https://roots.soundbluemusic.com',
  ),
  component: ConstantsPageKo,
});

function ConstantsPageKo() {
  const { locale, t } = useI18n();

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-(--text-primary) mb-8">{t('constants')}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mathConstants.map((constant) => (
          <div
            key={constant.symbol}
            className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary) text-center"
          >
            <div className="text-4xl font-serif mb-2 text-(--accent-primary)">
              {constant.symbol}
            </div>
            <h2 className="text-base font-medium text-(--text-primary) mb-1">
              {constant.name[locale as keyof typeof constant.name] || constant.name.en}
            </h2>
            <p className="text-sm font-mono text-(--text-secondary)">{constant.value}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
