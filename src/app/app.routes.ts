import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { DefaultLayout } from './layouts/default-layout/default-layout';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { TransacaoPage } from './pages/transacao-page/transacao-page';
import { CategoriaPage } from './pages/configuracao/categoria-page/categoria-page';
import { AuthGuard } from './auth/auth.guard';
import { TransacaoPorCategoriaPage } from './pages/relatorio/transacao-por-categoria-page/transacao-por-categoria-page';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", component: LoginPage },
    { path:"", 
        component: DefaultLayout,
        canActivate: [AuthGuard],
        children: [
            { path: "", redirectTo: "dashboard", pathMatch: "full" },
            { path: "dashboard", component: DashboardPage, },
            { path: "transacao", component: TransacaoPage },
            { path: "configuracao/categoria", component: CategoriaPage },
            { path: "relatorio/transacao-por-categoria", component: TransacaoPorCategoriaPage }
        ]
    },
    { path: '**', redirectTo: '' }
];
