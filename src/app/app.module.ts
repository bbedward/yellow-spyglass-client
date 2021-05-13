import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

//pxblue modules
import {DrawerModule, EmptyStateModule, InfoListItemModule, ListItemTagModule} from '@pxblue/angular-components';

//material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// app
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { NavigationComponent } from './navigation/navigation.component';
import { PageTwoComponent } from './pages/page-two/page-two.component';
import { PageOneComponent } from './pages/page-one/page-one.component';
import { HttpClientModule } from '@angular/common/http';
import { ExploreComponent } from './pages/explore/explore.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {SafeHtmlPipe} from "./pipes/safe.pipe";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ResponsiveDirective} from "./directives/responsive.directive";

@NgModule({
    declarations: [
        AppComponent,
        ExploreComponent,
        NavigationComponent,
        PageOneComponent,
        PageTwoComponent,
        ResponsiveDirective,
        SafeHtmlPipe,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        DrawerModule,
        EmptyStateModule,
        FlexLayoutModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        ListItemTagModule,
        RouterModule,
        ReactiveFormsModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
