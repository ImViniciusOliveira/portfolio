import { Component, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Mail } from '../services/mail';
import { gsap } from 'gsap';

export function animateContactSubmitButton(repeatCount: number = 2): gsap.core.Timeline | undefined {
  if (typeof document === 'undefined') return undefined;

  const btn = document.querySelector('.contact-submit-btn');
  const wave = document.querySelector('.contact-btn-wave');

  if (!btn) return undefined;

  const cycleDuration = 1.8;
  const halfCycle = cycleDuration / 2;

  const tl = gsap.timeline({
    repeat: repeatCount > 0 ? repeatCount - 1 : -1,
    overwrite: 'auto',
    onComplete: () => {
      gsap.to(btn, {
        scale: 1,
        boxShadow: '0 0 0 0 rgba(30, 58, 138, 0)',
        duration: 0.4,
        ease: 'power1.out'
      });
      if (wave) {
        gsap.to(wave, {
          opacity: 0,
          duration: 0.4,
          ease: 'power1.out',
          onComplete: () => gsap.set(wave, { scale: 0 })
        });
      }
    }
  });

  // 1. Pulsar do botão + Aura de brilho azul externa (Duração total de 1.8s)
  tl.to(btn, {
    scale: 1.03,
    boxShadow: '0 0 18px 5px rgba(30, 58, 138, 0.45)',
    duration: halfCycle,
    ease: 'power1.out'
  }, 0)
  .to(btn, {
    scale: 1,
    boxShadow: '0 0 0 0 rgba(30, 58, 138, 0)',
    duration: halfCycle,
    ease: 'power1.inOut'
  }, halfCycle);

  // 2. Onda circular fina (Duração exata de 1.8s amarrada ao pulso)
  if (wave) {
    tl.fromTo(
      wave,
      { scale: 0, opacity: 1 },
      {
        scale: 32,
        opacity: 0,
        duration: cycleDuration,
        ease: 'power2.out'
      },
      0
    );
  }

  return tl;
}

@Component({
  imports: [FormsModule],
  selector: 'app-contact',
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact implements OnDestroy {

  private readonly mailService = inject(Mail);
  private validTimeline?: gsap.core.Timeline;

  isSubmitting = signal(false);
  showAlert = signal(false);
  alertMessage = signal('');
  isSuccess = signal(true);

  contactFormValues = {
    name: '',
    email: '',
    body: '',
  };

  private isFormFullyValid(contactForm?: NgForm): boolean {
    if (this.isSubmitting()) return false;

    const name = (this.contactFormValues.name || '').trim();
    const email = (this.contactFormValues.email || '').trim();
    const body = (this.contactFormValues.body || '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valuesValid = name.length >= 2 && emailRegex.test(email) && body.length >= 10;

    if (!valuesValid) return false;

    if (contactForm && contactForm.controls) {
      const controls = contactForm.controls;
      if (controls['name'] && controls['name'].invalid) return false;
      if (controls['email'] && controls['email'].invalid) return false;
      if (controls['body'] && controls['body'].invalid) return false;
      if (contactForm.invalid) return false;
    }

    return true;
  }

  checkFormValidity(contactForm: NgForm): void {
    const valid = this.isFormFullyValid(contactForm);

    if (valid) {
      if (!this.validTimeline) {
        this.validTimeline = animateContactSubmitButton(-1);
      }
    } else {
      if (this.validTimeline) {
        this.validTimeline.pause();
        this.validTimeline.kill();
        this.validTimeline = undefined;
      }
      this.resetButtonState();
    }
  }

  private resetButtonState(): void {
    if (typeof document === 'undefined') return;
    const btn = document.querySelector('.contact-submit-btn');
    const wave = document.querySelector('.contact-btn-wave');

    if (btn) {
      gsap.to(btn, {
        scale: 1,
        boxShadow: '0 0 0 0 rgba(30, 58, 138, 0)',
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    if (wave) {
      gsap.to(wave, {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }

  async submitEmail(contactForm: NgForm) {
    if (contactForm.invalid || this.isSubmitting()) {
      contactForm.control.markAllAsTouched();
      return;
    }

    if (this.validTimeline) {
      this.validTimeline.kill();
      this.validTimeline = undefined;
      this.resetButtonState();
    }

    this.isSubmitting.set(true);
    this.showAlert.set(false);

    const formData = new FormData();
    formData.append('name', this.contactFormValues.name);
    formData.append('email', this.contactFormValues.email);
    formData.append('message', this.contactFormValues.body);
    formData.append('access_key', '62b459c0-0916-4609-96f5-0f57906eb019');
    formData.append('subject', 'Contato via Portfólio');
    formData.append('from_name', 'Portfólio Web');

    try {
      const res = await this.mailService.sendEmail(formData);
      if (!res.ok) throw new Error('Falha ao enviar o e-mail.');

      this.alertMessage.set('E-mail enviado com sucesso!');
      this.isSuccess.set(true);
      contactForm.resetForm();
    } catch {
      this.alertMessage.set('Ocorreu um erro ao enviar. Tente novamente!');
      this.isSuccess.set(false);
    } finally {
      this.isSubmitting.set(false);
      this.showAlert.set(true);
      setTimeout(() => this.showAlert.set(false), 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.validTimeline) {
      this.validTimeline.kill();
    }
  }
}
