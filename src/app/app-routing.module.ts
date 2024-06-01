import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'cliente-list',
    loadChildren: () => import('./cliente/cliente-list/cliente-list.module').then( m => m.ClienteListPageModule)
  },
  {
    path: 'cliente-edit',
    loadChildren: () => import('./cliente/cliente-edit/cliente-edit.module').then( m => m.ClienteEditPageModule)
  }, {
    path: 'cliente-edit/:id',
    loadChildren: () => import('./cliente/cliente-edit/cliente-edit.module').then( m => m.ClienteEditPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}