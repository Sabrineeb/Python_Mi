import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- Ajout ici
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    
    ],
  imports: [BrowserModule, FormsModule,HttpClientModule],
  providers: [],
  bootstrap: []
})
export class AppModule {}
