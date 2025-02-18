import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { EmptyStateModule, SpacerModule } from '@brightlayer-ui/angular-components';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ResponsiveDirective } from '@app/common/directives/responsive.directive';
import { SafeHtmlPipe } from '@app/common/pipes/safe.pipe';
import { ErrorComponent } from '@app/common/components/error/error.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommaPipe } from '@app/common/pipes/comma.directive';
import { PercentagePipe } from '@app/common/pipes/percentage.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CopyButtonComponent } from '@app/common/components/copy-button/copy-button.component';
import { BookmarkButtonComponent } from '@app/common/components/bookmark-button/bookmark-button.component';

@NgModule({
    declarations: [
        BookmarkButtonComponent,
        CommaPipe,
        CopyButtonComponent,
        ErrorComponent,
        PercentagePipe,
        ResponsiveDirective,
        SafeHtmlPipe,
    ],
    imports: [
        CommonModule,
        EmptyStateModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        SpacerModule,
    ],
    exports: [
        BookmarkButtonComponent,
        CommaPipe,
        CopyButtonComponent,
        ErrorComponent,
        PercentagePipe,
        ResponsiveDirective,
        SafeHtmlPipe,
    ],
})
export class AppCommonModule {}
