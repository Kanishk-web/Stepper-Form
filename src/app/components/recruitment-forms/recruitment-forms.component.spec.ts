import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentFormsComponent } from './recruitment-forms.component';

describe('RecruitmentFormsComponent', () => {
  let component: RecruitmentFormsComponent;
  let fixture: ComponentFixture<RecruitmentFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruitmentFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
