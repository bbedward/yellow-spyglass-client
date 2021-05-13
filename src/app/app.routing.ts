import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_NAV_ITEMS } from './navigation/nav-items';
import { HomeComponent } from './pages/home/home.component';
import { PageOneComponent } from './pages/page-one/page-one.component';
import { PageTwoComponent } from './pages/page-two/page-two.component';
import { ExploreComponent } from './pages/explore/explore.component';

const routes: Routes = [
    { path: '', redirectTo: APP_NAV_ITEMS.search.route, pathMatch: 'full' },
    { path: APP_NAV_ITEMS.search.route, component: ExploreComponent },
    { path: APP_NAV_ITEMS.page1.route, component: PageOneComponent },
    { path: APP_NAV_ITEMS.page2.route, component: PageTwoComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
