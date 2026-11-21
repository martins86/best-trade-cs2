import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutStateService {
  readonly isMobile = signal(false);
  readonly isCompact = signal(false);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe('(max-width: 600px)').subscribe(result => this.isMobile.set(result.matches));
    this.breakpointObserver.observe('(min-width: 601px) and (max-width: 1200px)').subscribe(result => this.isCompact.set(result.matches));
  }
}
