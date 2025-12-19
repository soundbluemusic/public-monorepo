import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import { useI18n } from '@/i18n';
import { Meta, Title } from '@solidjs/meta';
import { A } from '@solidjs/router';

export default function AboutPage() {
  const { locale, t, localePath } = useI18n();

  const getContent = () => {
    if (locale() === 'ko') {
      return {
        title: 'Context 소개',
        description:
          '한국어를 배우는 학습자들을 위한 의미 사전입니다. 한국어 단어의 의미를 영어로 자세히 설명합니다.',
        stats: `${categories.length}개 카테고리 · ${meaningEntries.length}개 단어 · 2개 언어`,
      };
    }
    return {
      title: 'About Context',
      description:
        'A meaning dictionary for Korean learners. Korean words explained in detail in English.',
      stats: `${categories.length} categories · ${meaningEntries.length} words · 2 languages`,
    };
  };

  const content = getContent();

  return (
    <Layout>
      <Title>{t('about')} - Context</Title>
      <Meta name="description" content={content.description} />

      <div class="mb-8">
        <h1 class="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {content.title}
        </h1>
        <p class="leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
          {content.description}
        </p>
        <p class="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {content.stats}
        </p>
      </div>

      <div class="pt-6" style={{ 'border-top': '1px solid var(--border-primary)' }}>
        <A href={localePath('/browse')} class="text-sm" style={{ color: 'var(--accent-primary)' }}>
          {t('browse')} →
        </A>
      </div>
    </Layout>
  );
}
