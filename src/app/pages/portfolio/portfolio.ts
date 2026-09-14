import {
  Component,
  ElementRef,
  ViewChild,
  signal,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../contact/contact';

import {
  LucideAngularModule,
  Link2,
  Webhook,
  Store,
  GitBranch,
  Braces
} from 'lucide-angular';

interface SkillItem {
  name: string;
  icon: string;
  iconType: 'devicon' | 'lucide' | 'image';
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

interface Project {
  title: string;
  description: string;
  year: string;
  techs: string[];
  link?: string;
}

@Component({
  imports: [
    FormsModule,
    Contact,
    LucideAngularModule
  ],

  selector: 'app-portfolio',
  styleUrl: './portfolio.css',
  templateUrl: './portfolio.html',
})
export class Portfolio implements AfterViewInit, OnDestroy {
  @ViewChild('portfolioContainer') portfolioContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('node1Card') node1Card!: ElementRef<HTMLDivElement>;
  @ViewChild('node2Card') node2Card!: ElementRef<HTMLDivElement>;
  @ViewChild('node3Card') node3Card!: ElementRef<HTMLDivElement>;
  @ViewChild('node4Card') node4Card!: ElementRef<HTMLDivElement>;
  @ViewChild('node5Card') node5Card!: ElementRef<HTMLDivElement>;

  path1 = signal<string>('');
  path2 = signal<string>('');
  path3 = signal<string>('');
  path4 = signal<string>('');

  private resizeObserver?: ResizeObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Calcula os caminhos SVG após a renderização dos componentes
    setTimeout(() => {
      this.calculatePaths();
    }, 150);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculatePaths();
      });
      if (this.portfolioContainer?.nativeElement) {
        this.resizeObserver.observe(this.portfolioContainer.nativeElement);
      }
    }
  }

  calculatePaths(): void {
    if (
      !this.portfolioContainer ||
      !this.node1Card ||
      !this.node2Card ||
      !this.node3Card ||
      !this.node4Card ||
      !this.node5Card
    ) {
      return;
    }

    const containerRect = this.portfolioContainer.nativeElement.getBoundingClientRect();

    const getCoords = (el: ElementRef<HTMLDivElement>) => {
      const rect = el.nativeElement.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        yTop: rect.top - containerRect.top,
        yBottom: rect.bottom - containerRect.top
      };
    };

    const n1 = getCoords(this.node1Card);
    const n2 = getCoords(this.node2Card);
    const n3 = getCoords(this.node3Card);
    const n4 = getCoords(this.node4Card);
    const n5 = getCoords(this.node5Card);

    // Conecta a base inferior de um nó com o topo do próximo em curva 'S'
    this.path1.set(this.buildSPath(n1.x, n1.yBottom, n2.x, n2.yTop));
    this.path2.set(this.buildSPath(n2.x, n2.yBottom, n3.x, n3.yTop));
    this.path3.set(this.buildSPath(n3.x, n3.yBottom, n4.x, n4.yTop));
    this.path4.set(this.buildSPath(n4.x, n4.yBottom, n5.x, n5.yTop));
  }

  private buildSPath(x1: number, y1: number, x2: number, y2: number): string {
    const midY = y1 + (y2 - y1) * 0.5;
    return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  Link2 = Link2;
  Webhook = Webhook;
  Store = Store;
  GitBranch = GitBranch;
  Braces = Braces;

  skillCategories = signal<SkillCategory[]>([
    {
      category: 'Backend',
      items: [
        { name: 'Java', icon: 'devicon-java-plain', iconType: 'devicon' },
        { name: 'Spring Boot', icon: 'devicon-spring-plain', iconType: 'devicon' },
        { name: 'REST API', icon: 'devicon-fastapi-plain', iconType: 'devicon' },
        { name: 'JWT', icon: 'devicon-json-plain', iconType: 'devicon' },
        { name: 'HATEOAS', icon: 'Link2', iconType: 'lucide' },
        { name: 'MapStruct', icon: 'Braces', iconType: 'lucide' },
        { name: 'Flyway', icon: 'Flyway_logo.svg', iconType: 'image' }
      ]
    },

    {
      category: 'Automation',
      items: [
        { name: 'n8n', icon: 'n8n.png', iconType: 'image' },
        { name: 'Webhooks', icon: 'Webhook', iconType: 'lucide' },
        { name: 'Marketplace APIs', icon: 'Store', iconType: 'lucide' }
      ]
    },

    {
      category: 'Frontend',
      items: [
        { name: 'Angular', icon: 'devicon-angularjs-plain', iconType: 'devicon' },
        { name: 'TypeScript', icon: 'devicon-typescript-plain', iconType: 'devicon' },
        { name: 'Angular Material', icon: 'devicon-materialui-plain', iconType: 'devicon' },
        { name: 'Bootstrap', icon: 'devicon-bootstrap-plain', iconType: 'devicon' },
        { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain', iconType: 'devicon' },
        { name: 'RxJS', icon: 'devicon-rxjs-plain', iconType: 'devicon' }
      ]
    },

    {
      category: 'Monitoring',
      items: [
        { name: 'Prometheus', icon: 'devicon-prometheus-plain', iconType: 'devicon' },
        { name: 'Grafana', icon: 'devicon-grafana-plain', iconType: 'devicon' },
        { name: 'JUnit', icon: 'devicon-junit-plain', iconType: 'devicon' },
        { name: 'Mockito', icon: 'logo-mockito.png', iconType: 'image' },
        { name: 'Spring Test', icon: 'devicon-spring-plain', iconType: 'devicon' }
      ]
    },

    {
      category: 'Database',
      items: [
        { name: 'PostgreSQL', icon: 'devicon-postgresql-plain', iconType: 'devicon' },
        { name: 'MongoDB', icon: 'devicon-mongodb-plain', iconType: 'devicon' },
        { name: 'Redis', icon: 'devicon-redis-plain', iconType: 'devicon' }
      ]
    },

    {
      category: 'Tools',
      items: [
        { name: 'Git', icon: 'devicon-git-plain', iconType: 'devicon' },
        { name: 'GitHub', icon: 'devicon-github-original', iconType: 'devicon' },
        { name: 'Swagger', icon: 'devicon-swagger-plain', iconType: 'devicon' },
        { name: 'OpenAPI', icon: 'devicon-openapi-plain', iconType: 'devicon' },
        { name: 'Linux', icon: 'devicon-linux-plain', iconType: 'devicon' }
      ]
    },

    {
      category: 'DevOps',
      items: [
        { name: 'Docker', icon: 'devicon-docker-plain', iconType: 'devicon' },
        { name: 'Kubernetes', icon: 'devicon-kubernetes-plain', iconType: 'devicon' },
        { name: 'Nginx', icon: 'devicon-nginx-plain', iconType: 'devicon' },
        { name: 'Azure', icon: 'devicon-azure-plain', iconType: 'devicon' },
        { name: 'Oracle Cloud', icon: 'devicon-oracle-plain', iconType: 'devicon' },
        { name: 'GitHub Actions', icon: 'devicon-githubactions-plain', iconType: 'devicon' },
        { name: 'CI/CD', icon: 'GitBranch', iconType: 'lucide' }
      ]
    }
  ]);

  projects = signal<Project[]>([
    {
      title: 'Order Integration API',
      year: '2026 - Atual',
      description: 'API RESTful com Java Spring Boot...',
      techs: ['Java', 'Spring Boot', 'Redis', 'PostgreSQL'],
      link: 'https://github.com/ImViniciusOliveira/order-integration-api'
    },
    {
      title: 'DCriar - ERP de Estoque',
      year: '2025 - 2026',
      description: 'Solução ERP full stack em monorepo...',
      techs: ['Angular SSR', 'Spring Boot', 'MinIO'],
      link: 'https://github.com/ImViniciusOliveira/DCriar-gerenciamento'
    },
    {
      title: 'UpGeek E-commerce',
      year: '2025 - 2026',
      description: 'Plataforma de e-commerce voltada para colecionáveis...',
      techs: ['Microsserviços', 'HATEOAS', 'Flyway'],
      link: 'https://github.com/ImViniciusOliveira/upgeek-api'
    }
  ]);

  contactForm = signal({
    name: '',
    email: '',
    message: ''
  });

  isSubmitting = signal(false);
  submitSuccess = signal(false);

  onSubmit(): void {
    const { email, message } = this.contactForm();

    if (!email || !message) {
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);

      this.contactForm.set({
        name: '',
        email: '',
        message: ''
      });
    }, 1000);
  }
}
