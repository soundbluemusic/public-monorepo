export type Styles = {
  darkModeToggle: string;
  languageToggle: string;
  offlineBanner: string;
  offlineIcon: string;
  reconnectedToast: string;
  searchContainer: string;
  searchDropdown: string;
  searchIcon: string;
  searchInput: string;
  searchInputWrapper: string;
  searchLoading: string;
  searchNoResults: string;
  searchResultButton: string;
  searchResultButtonSelected: string;
  searchResultContent: string;
  searchResultField: string;
  searchResultName: string;
  skeleton: string;
  skeletonAvatar: string;
  skeletonCard: string;
  skeletonCardBody: string;
  skeletonCardHeader: string;
  skeletonGrid: string;
  skeletonGrid2: string;
  skeletonGrid3: string;
  skeletonGrid4: string;
  skeletonLine: string;
  skeletonLineShort: string;
  skeletonList: string;
  skeletonListContent: string;
  skeletonListDesc: string;
  skeletonListItem: string;
  skeletonListTitle: string;
  skeletonPage: string;
  skeletonPageSubtitle: string;
  skeletonPageTitle: string;
  skeletonPulse: string;
  skeletonText: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
