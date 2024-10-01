import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Import this module
import { AppComponent } from './app.component';
import { CurrencyConverterComponent } from './currency-converter/currency-converter.component';

// Adjust the import based on your file structure

@NgModule({
    declarations: [
        AppComponent,
        CurrencyConverterComponent, // Add your component here
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
    
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
