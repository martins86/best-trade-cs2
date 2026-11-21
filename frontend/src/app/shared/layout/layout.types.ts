export interface ApplicationShell {
  activeDestination: string;
  compactDesktop: boolean;
  mobileMenuOpen: boolean;
}

export interface NavigationDestination {
  id: string;
  label: string;
  route: string | null;
  available: boolean;
  icon: string;
}
