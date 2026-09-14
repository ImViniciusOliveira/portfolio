import { Component, signal } from '@angular/core';
import { inject as injectAnalytics } from '@vercel/analytics';
import { Footer } from './shared/footer/footer';
import { Portfolio } from './pages/portfolio/portfolio';
import { Header } from './shared/header/header';

@Component({
  imports: [Header, Portfolio, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('meu-portfolio');

  constructor() {
    if (typeof window !== 'undefined') {
      injectAnalytics();
    }
  }
}
