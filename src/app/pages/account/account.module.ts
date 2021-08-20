import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmptyStateModule, InfoListItemModule, ListItemTagModule } from '@pxblue/angular-components';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppCommonModule } from '@app/common/app-common.module';
import { AccountComponent } from '@app/pages/account/account.component';
import { ConfirmedTabComponent } from '@app/pages/account/tabs/confirmed/confirmed-tab.component';
import { DelegatorsTabComponent } from '@app/pages/account/tabs/delegators/delegators-tab.components';
import { PendingTabComponent } from '@app/pages/account/tabs/pending/pending-tab.component';
import { InsightsTabComponent } from '@app/pages/account/tabs/insights/insights-tab.components';

@NgModule({
    declarations: [
        AccountComponent,
        ConfirmedTabComponent,
        DelegatorsTabComponent,
        PendingTabComponent,
        InsightsTabComponent,
    ],
    imports: [
        AppCommonModule,
        BrowserAnimationsModule,
        CommonModule,
        EmptyStateModule,
        InfoListItemModule,
        ListItemTagModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatTableModule,
        ReactiveFormsModule,
        HighchartsChartModule,
    ],
    exports: [
        AccountComponent,
        ConfirmedTabComponent,
        DelegatorsTabComponent,
        PendingTabComponent,
        InsightsTabComponent,
    ],
})
export class AccountModule {}
