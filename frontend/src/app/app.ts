import { Component } from '@angular/core';
import { AppShellComponent } from './shared/layout/app-shell.component';

@Component({
  imports: [AppShellComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  template: '<app-shell />',
})
export class App {}
