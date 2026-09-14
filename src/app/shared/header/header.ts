import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private isManualScrolling = false;
  private tl?: gsap.core.Timeline;

  @ViewChild('menuOverlay') menuOverlay?: ElementRef<HTMLDivElement>;

  isMenuOpen = signal(false);
  isMenuVisible = signal(false);
  activeSection = signal<string>('hero');

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.initIntersectionObserver();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.tl?.kill();
  }

  private initIntersectionObserver(): void {
    const sections = ['hero', 'about', 'skills', 'projects', 'contact'];

    this.observer = new IntersectionObserver(
      (entries) => {
        if (this.isManualScrolling) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        this.observer?.observe(el);
      }
    });
  }

  openMenu(): void {
    this.isMenuVisible.set(true);
    this.isMenuOpen.set(true);

    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => {
      const overlay = this.menuOverlay?.nativeElement;
      if (!overlay) return;

      const items = overlay.querySelectorAll('.mobile-menu-item');

      this.tl?.kill();
      this.tl = gsap.timeline();

      // 1. Overlay (fundo bege) faz fade-in
      this.tl.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );

      // 2. Links entram em sequência (stagger) com offset de tempo -=0.15s
      this.tl.fromTo(
        items,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power3.out' },
        '-=0.15'
      );
    });
  }

  closeMenu(onClosed?: () => void): void {
    if (!this.isMenuVisible()) {
      onClosed?.();
      return;
    }

    this.isMenuOpen.set(false);

    if (!isPlatformBrowser(this.platformId)) {
      this.isMenuVisible.set(false);
      onClosed?.();
      return;
    }

    const overlay = this.menuOverlay?.nativeElement;
    const items = overlay?.querySelectorAll('.mobile-menu-item');

    if (!overlay || !items || items.length === 0) {
      this.isMenuVisible.set(false);
      onClosed?.();
      return;
    }

    this.tl?.kill();
    this.tl = gsap.timeline({
      onComplete: () => {
        this.isMenuVisible.set(false);
        if (onClosed) {
          onClosed();
        }
      }
    });

    // 1. Links somem em velocidade rápida
    this.tl.to(items, {
      opacity: 0,
      y: 12,
      duration: 0.12,
      stagger: 0.02,
      ease: 'power2.in'
    });

    // 2. Fundo fecha logo em seguida com pequena sobreposição -=0.06s
    this.tl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.16,
        ease: 'power2.in'
      },
      '-=0.06'
    );
  }

  scrollToSection(sectionId: string): void {
    this.activeSection.set(sectionId);
    this.isManualScrolling = true;

    const performScroll = () => {
      if (sectionId === 'hero') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }

      setTimeout(() => {
        this.isManualScrolling = false;
      }, 700);
    };

    if (this.isMenuOpen()) {
      this.closeMenu(performScroll);
    } else {
      performScroll();
    }
  }

  toggleMenu(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
}
