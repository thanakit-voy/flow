import { Component } from '@angular/core';
import { NxWelcome } from './nx-welcome';

@Component({
  standalone: true,
  imports: [NxWelcome],
  selector: 'app-dashboard-entry',
  template: `<app-nx-welcome></app-nx-welcome>`,
})
export class RemoteEntry {}
