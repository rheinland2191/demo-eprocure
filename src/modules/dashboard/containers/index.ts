import { DashboardCreateComponent } from './dashboard-create/dashboard-create.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const containers = [
    DashboardComponent,
    DashboardDetailComponent,
    DashboardCreateComponent,
    DashboardEditComponent,
];

export * from './dashboard/dashboard.component';
export * from './dashboard-detail/dashboard-detail.component';
export * from './dashboard-create/dashboard-create.component';
export * from './dashboard-edit/dashboard-edit.component';
