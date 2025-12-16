import { For, createMemo, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { categories, getCategoryColor } from "@/data/categories";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar(props: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const sortedCategories = createMemo(() =>
    [...categories].sort((a, b) => a.order - b.order)
  );

  return (
    <aside
      class={`fixed top-16 left-0 bottom-0 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
        props.isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav class="h-full overflow-y-auto py-4 px-3">
        {/* 홈 링크 */}
        <div class="mb-4">
          <A
            href="/"
            class={`sidebar-link ${isActive("/") && location.pathname === "/" ? "sidebar-link-active" : ""}`}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>홈</span>
          </A>
        </div>

        {/* 전체보기 */}
        <div class="mb-4">
          <A
            href="/browse"
            class={`sidebar-link ${isActive("/browse") ? "sidebar-link-active" : ""}`}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>전체보기</span>
          </A>
        </div>

        {/* 구분선 */}
        <div class="border-t border-gray-200 dark:border-gray-700 my-4" />

        {/* 카테고리 섹션 */}
        <div class="mb-2 px-4">
          <h3 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            카테고리
          </h3>
        </div>

        {/* 카테고리 목록 */}
        <div class="space-y-1">
          <For each={sortedCategories()}>
            {(category) => (
              <div>
                <A
                  href={`/category/${category.id}`}
                  class={`sidebar-link ${isActive(`/category/${category.id}`) ? "sidebar-link-active" : ""}`}
                >
                  <span
                    class={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${getCategoryColor(category.color)}`}
                  >
                    {category.icon}
                  </span>
                  <span class="flex-1 truncate">{category.name}</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">
                    {category.subcategories.length}
                  </span>
                </A>

                {/* 활성화된 카테고리의 하위 카테고리 표시 */}
                <Show when={isActive(`/category/${category.id}`)}>
                  <div class="ml-10 mt-1 space-y-1">
                    <For each={category.subcategories}>
                      {(sub) => (
                        <A
                          href={`/category/${category.id}/${sub.id}`}
                          class={`block px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            location.pathname === `/category/${category.id}/${sub.id}`
                              ? "text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-medium"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {sub.name}
                        </A>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            )}
          </For>
        </div>

        {/* 구분선 */}
        <div class="border-t border-gray-200 dark:border-gray-700 my-4" />

        {/* 추가 링크 */}
        <div class="space-y-1">
          <A
            href="/about"
            class={`sidebar-link ${isActive("/about") ? "sidebar-link-active" : ""}`}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>소개</span>
          </A>
          <A
            href="/contribute"
            class={`sidebar-link ${isActive("/contribute") ? "sidebar-link-active" : ""}`}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>기여하기</span>
          </A>
        </div>
      </nav>
    </aside>
  );
}
