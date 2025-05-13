import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  students: any[] = [];
  formations: any[] = [];
  departements: any[] = [];
  totalStudents = 0;
  totalFormations = 0;

  newStudent = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    departement_id: 1
  };

  newFormation = {
    title: '',
    description: '',
    departement_id: 1
  };

  private studentApi = 'http://localhost:9001/students';
  private formationApi = 'http://localhost:9001/formations';
  private departementApi = 'http://localhost:9001/departements';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.getStudents();
    this.getFormations();
    this.getDepartements();
  }

  getStudents(): void {
    this.http.get<any[]>(this.studentApi).subscribe(data => {
      this.students = data;
      this.totalStudents = data.length;
    });
  }

  getFormations(): void {
    this.http.get<any[]>(this.formationApi).subscribe(data => {
      this.formations = data;
      this.totalFormations = data.length;
    });
  }

  getDepartements(): void {
    this.http.get<any[]>(this.departementApi).subscribe(data => {
      this.departements = data;
    });
  }

  getDepartementNom(id: number): string {
    const dep = this.departements.find(d => d.id === id);
    return dep ? dep.name : 'Inconnu';
  }

  addStudent(): void {
  this.http.post(this.studentApi, this.newStudent, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).subscribe({
    next: () => {
      this.newStudent = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        departement_id: 1
      };
      this.getStudents();
    },
    error: err => console.error('Erreur ajout étudiant :', err)
  });
}


  addFormation(): void {
    this.http.post(this.formationApi, this.newFormation).subscribe({
      next: () => {
        this.newFormation = {
          title: '',
          description: '',
          departement_id: 1
        };
        this.getFormations();
      },
      error: err => console.error('Erreur ajout formation :', err)
    });
  }
  inscription = {
  student_id: 0,
  formation_id: 0
};

getStudentsByFormation(formationId: number): void {
  this.http.get<any[]>(`http://localhost:9001/formations/${formationId}/students`).subscribe(data => {
    console.log("Étudiants inscrits à la formation :", data);
    // Tu peux les afficher dans le template avec une variable
  });
}


}