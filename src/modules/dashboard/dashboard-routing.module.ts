/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SBRouteData } from '@modules/navigation/models';

/* Module */
import { DashboardModule } from './dashboard.module';

/* Containers */
import * as dashboardContainers from './containers';

/* Guards */
import * as dashboardGuards from './guards';

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        data: {
            title: 'Tender List - SB Admin Angular',
            breadcrumbs: [
                {
                    text: 'Tender List',
                    active: true,
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.DashboardComponent,
    },
    {
        path: 'detail/:id',
        data: {
            title: 'Tender Detail - SB Admin Angular',
            breadcrumbs: [
                {
                    text: 'Tender Detail',
                    link: '/tender/detail/:id',
                },
                {
                    text: 'Tender Detail',
                    active: true,
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.DashboardDetailComponent,
    },
    {
        path: 'edit/:id',
        data: {
            title: 'Tender Edit - SB Admin Angular',
            breadcrumbs: [
                {
                    text: 'Tender Edit',
                    link: '/tender/edit/:id',
                },
                {
                    text: 'Tender Edit',
                    active: true,
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.DashboardEditComponent,
    },
    {
        path: 'create',
        data: {
            title: 'Create Tender - SB Admin Angular',
            breadcrumbs: [
                {
                    text: 'Create Tender',
                    link: '/tender/create',
                },
                {
                    text: 'Tender Create',
                    active: true,
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.DashboardCreateComponent,
    },
];

@NgModule({
    imports: [DashboardModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
