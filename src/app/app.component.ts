import { Component } from '@angular/core';
import { RecruitmentFormsComponent } from './components/recruitment-forms/recruitment-forms.component';

@Component({
  selector: 'app-root',
  imports: [RecruitmentFormsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'stepper-forms';
}
