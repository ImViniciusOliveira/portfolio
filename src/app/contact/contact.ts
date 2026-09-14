import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Mail } from '../services/mail';

@Component({
  imports: [FormsModule],
  selector: 'app-contact',
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact {

  private readonly mailService = inject(Mail);

  isSubmitting = signal(false);
  showAlert = signal(false);
  alertMessage = signal('');
  isSuccess = signal(true);

  contactFormValues = {
    name: '',
    email: '',
    body: '',
  };

  async submitEmail(contactForm: NgForm) {
    if (contactForm.invalid || this.isSubmitting()) {
      contactForm.control.markAllAsTouched();
      return;
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
}
