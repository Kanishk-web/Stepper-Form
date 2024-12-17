import { ApiService } from './../../services/api.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-recruitment-forms',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recruitment-forms.component.html',
  styleUrl: './recruitment-forms.component.css',
})
export class RecruitmentFormsComponent {
  @ViewChild('content', { static: false }) el!: ElementRef;

  detailsForm: FormGroup;
  profileForm: FormGroup;
  educationForm: FormGroup;
  experienceForm: FormGroup;

  showCertificationDetails: boolean = false;

  currentStep = 1;

  constructor(
    private _formBuilder: FormBuilder,
    private ApiService: ApiService
  ) {
    this.detailsForm = this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      number: ['', Validators.required],
      address: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
    });

    this.profileForm = this._formBuilder.group({
      image: [null, [Validators.required]],
      profile: ['', [Validators.required, Validators.minLength(30)]],
    });

    this.educationForm = this._formBuilder.group({
      qualification: ['', Validators.required],
      universityName: ['', Validators.required],
      startYear: ['', Validators.required],
      endYear: ['', Validators.required],
      hasCertification: ['', Validators.required],
      certificationName: [''],
      instituteName: [''],
      certificationStartYear: [''],
      certificationEndYear: [''],
      addMore: [''],
    });

    this.experienceForm = this._formBuilder.group({
      hasExperience: ['', Validators.required],
      companyName: ['', Validators.required],
      position: ['', Validators.required],
      startYear: ['', Validators.required],
      state: ['', Validators.required],
      addMore: [''],
    });
  }

  url = '../../assets/images/personeImage.jpg';
  imageFile: File | null = null;

  onselectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.url = e.target.result;
      };
    }
  }

  onSubmit() {
    if (
      this.detailsForm.valid &&
      this.profileForm.valid &&
      this.educationForm.valid &&
      this.experienceForm.valid
    ) {
      const detailsData = this.detailsForm.value;
      const profileData = this.profileForm.value;
      const educationData = this.educationForm.value;
      const experienceData = this.experienceForm.value;

      this.ApiService.postUserData({
        detailsData,
        profileData,
        educationData,
        experienceData,
      }).subscribe(
        (response) => {
          console.log('Form is submitted : ', response);
        },
        (error) => {
          console.log('Error submitting the form : ', error);
        }
      );
    }
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // This function will enable/disable certification fields based on radio button selection
  onCertificationChange(value: string) {
    const certificationFields = [
      'certificationName',
      'instituteName',
      'startYear',
      'endYear',
    ];

    if (value === 'yes') {
      // Enable all certification fields with validation
      certificationFields.forEach((field) => {
        this.educationForm.get(field)?.setValidators([Validators.required]);
        this.educationForm.get(field)?.updateValueAndValidity();
      });
    } else {
      // Disable certification fields
      certificationFields.forEach((field) => {
        this.educationForm.get(field)?.clearValidators();
        this.educationForm.get(field)?.updateValueAndValidity();
      });
    }
  }

  // This function will enable/disable experience fields based on radio button selection
  onExperienceChange(value: string) {
    const experienceFields = ['companyName', 'position', 'startYear', 'state'];

    if (value === 'yes') {
      // Enable all experience fields with validation
      experienceFields.forEach((field) => {
        this.experienceForm.get(field)?.setValidators([Validators.required]);
        this.experienceForm.get(field)?.updateValueAndValidity();
      });
    } else {
      // Disable experience fields
      experienceFields.forEach((field) => {
        this.experienceForm.get(field)?.clearValidators();
        this.experienceForm.get(field)?.updateValueAndValidity();
      });
    }
  }

  hasCertification: string = '';
  hasExperience: string = '';

  openPDF() {
    const doc = new jsPDF();

    // Set Background Color
    doc.setFillColor(223, 227, 220);
    doc.rect(
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height,
      'F'
    );

    const title = 'RECRUITMENT FORMS DATA DETAILS';

    // Calculate the width of the text
    const textWidth = doc.getTextWidth(title);

    // Calculate the x-position to center the text
    const pageWidth = doc.internal.pageSize.width;
    const xName = (pageWidth - textWidth) / 2;

    doc.text(title, xName, 10);

    const profileData = [[this.profileForm.value.profile]];

    if (this.url) {
      doc.addImage(this.url, 'JPEG', 10, 30, 50, 50);
    }

    autoTable(doc, {
      // head: profileHeaders,
      body: profileData,
      startY: 30,
      margin: { left: 70 },
      headStyles: {
        fillColor: [61, 196, 171],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fillColor: [254, 205, 165],
      },
      styles: {
        fillColor: [254, 205, 165],
        textColor: [71, 71, 71],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
    });

    //detail Form Data

    const detailsHeaders = [
      [
        'First Name',
        'Last Name',
        'Email',
        'Number',
        'Address',
        'State',
        'Country',
      ],
    ];

    const detailsData = [
      [
        this.detailsForm.value.firstName,
        this.detailsForm.value.lastName,
        this.detailsForm.value.email,
        this.detailsForm.value.number,
        this.detailsForm.value.address,
        this.detailsForm.value.state,
        this.detailsForm.value.country,
      ],
    ];

    autoTable(doc, {
      head: detailsHeaders,
      body: detailsData,
      startY: 100,
      headStyles: {
        fillColor: [61, 196, 171],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fillColor: [179, 227, 218],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      styles: {
        fillColor: [254, 205, 165],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
    });

    // Education Form Qualification Data
    const educationHeaders = [
      ['Qualification', 'University Name', 'Start Year', 'End Year'],
    ];
    const educationData = [
      [
        this.educationForm.value.qualification,
        this.educationForm.value.universityName,
        this.educationForm.value.startYear,
        this.educationForm.value.endYear,
      ],
    ];

    autoTable(doc, {
      head: educationHeaders,
      body: educationData,
      startY: 140,
      headStyles: {
        fillColor: [61, 196, 171],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fillColor: [254, 205, 165],
      },
      styles: {
        fillColor: [254, 205, 165],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
    });

    // Education Form Qualification Data

    const educationQualificationHeaders = [
      ['Certification Name', 'Institute Name', 'Start Year', 'End Year'],
    ];

    if (this.hasCertification === 'yes') {
      const educationCertificationData = [
        [
          this.educationForm.value.certificationName,
          this.educationForm.value.instituteName,
          this.educationForm.value.certificationStartYear,
          this.educationForm.value.certificationEndYear,
        ],
      ];

      autoTable(doc, {
        head: educationQualificationHeaders,
        body: educationCertificationData,
        startY: 180,
        headStyles: {
          fillColor: [61, 196, 171],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
        bodyStyles: {
          fillColor: [254, 205, 165],
        },
        styles: {
          fillColor: [254, 205, 165],
          textColor: [0, 0, 0],
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
      });
    }

    // Experience Form Data
    const experienceHeaders = [
      ['Company Name', 'Job Title', 'Start Year', 'State'],
    ];

    if (this.hasExperience === 'yes') {
      const experienceData = [
        [
          this.experienceForm.value.companyName,
          this.experienceForm.value.position,
          this.experienceForm.value.startYear,
          this.experienceForm.value.state,
        ],
      ];

      autoTable(doc, {
        head: experienceHeaders,
        body: experienceData,
        startY: 220,
        headStyles: {
          fillColor: [61, 196, 171],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
        bodyStyles: {
          fillColor: [254, 205, 165],
        },
        styles: {
          fillColor: [245, 245, 245],
          textColor: [0, 0, 0],
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
      });
    }

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  generatePDF() {
    const doc = new jsPDF();

    doc.setFillColor(223, 227, 220);
    doc.rect(
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height,
      'F'
    );

    const title = 'RECRUITMENT FORMS DATA DETAILS';

    const textWidth = doc.getTextWidth(title);

    const pageWidth = doc.internal.pageSize.width;
    const xName = (pageWidth - textWidth) / 2;

    doc.text(title, xName, 10);

    // Profile Form Data
    const profileData = [[this.profileForm.value.profile]];

    if (this.url) {
      doc.addImage(this.url, 'JPEG', 10, 30, 50, 50);
    }

    autoTable(doc, {
      body: profileData,
      startY: 30,
      margin: { left: 70 },
      headStyles: {
        fillColor: [61, 196, 171],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fillColor: [254, 205, 165],
      },
      styles: {
        fillColor: [254, 205, 165],
        textColor: [71, 71, 71],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
    });

    //detail Form Data

    const detailsHeaders = [
      [
        'First Name',
        'Last Name',
        'Email',
        'Number',
        'Address',
        'State',
        'Country',
      ],
    ];

    const detailsData = [
      [
        this.detailsForm.value.firstName,
        this.detailsForm.value.lastName,
        this.detailsForm.value.email,
        this.detailsForm.value.number,
        this.detailsForm.value.address,
        this.detailsForm.value.state,
        this.detailsForm.value.country,
      ],
    ];

    autoTable(doc, {
      head: detailsHeaders,
      body: detailsData,
      startY: 100,
      headStyles: {
        fillColor: [61, 196, 171],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fillColor: [179, 227, 218],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      styles: {
        fillColor: [254, 205, 165],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
    });

    // Education Form Qualification Data
    const educationHeaders = [
      ['Qualification', 'University Name', 'Start Year', 'End Year'],
    ];
    const educationData = [
      [
        this.educationForm.value.qualification,
        this.educationForm.value.universityName,
        this.educationForm.value.startYear,
        this.educationForm.value.endYear,
      ],
    ];

    autoTable(doc, {
      head: educationHeaders,
      body: educationData,
      startY: 140,
      headStyles: {
        fillColor: [61, 196, 171],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fillColor: [254, 205, 165],
      },
      styles: {
        fillColor: [254, 205, 165],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
    });

    // Education Form Qualification Data

    const educationQualificationHeaders = [
      ['Certification Name', 'Institute Name', 'Start Year', 'End Year'],
    ];

    if (this.hasCertification === 'yes') {
      const educationCertificationData = [
        [
          this.educationForm.value.certificationName,
          this.educationForm.value.instituteName,
          this.educationForm.value.certificationStartYear,
          this.educationForm.value.certificationEndYear,
        ],
      ];

      autoTable(doc, {
        head: educationQualificationHeaders,
        body: educationCertificationData,
        startY: 180,
        headStyles: {
          fillColor: [61, 196, 171],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
        bodyStyles: {
          fillColor: [254, 205, 165],
        },
        styles: {
          fillColor: [254, 205, 165],
          textColor: [0, 0, 0],
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
      });
    }

    // Experience Form Data
    const experienceHeaders = [
      ['Company Name', 'Job Title', 'Start Year', 'State'],
    ];

    if (this.hasExperience === 'yes') {
      const experienceData = [
        [
          this.experienceForm.value.companyName,
          this.experienceForm.value.position,
          this.experienceForm.value.startYear,
          this.experienceForm.value.state,
        ],
      ];

      autoTable(doc, {
        head: experienceHeaders,
        body: experienceData,
        startY: 220,
        headStyles: {
          fillColor: [61, 196, 171],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
        bodyStyles: {
          fillColor: [254, 205, 165],
        },
        styles: {
          fillColor: [245, 245, 245],
          textColor: [0, 0, 0],
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
      });
    }

    doc.save('FormDetails.pdf');
  }
}
