import { TestBed } from '@angular/core/testing';
import { Mail } from './mail';

describe('Mail', () => {
  let service: Mail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
