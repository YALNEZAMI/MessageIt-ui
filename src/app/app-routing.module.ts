import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './adminFolder/admin/admin.component';
import { ConvComponent } from './convFolder/conv/conv.component';
import { ConvsAdminComponent } from './adminFolder/convs-admin/convs-admin.component';
import { SearchComponent } from './adminFolder/search/search.component';
import { NotifsComponent } from './adminFolder/notifs/notifs.component';
import { ProfileComponent } from './adminFolder/profile/profile.component';
import { SearchAdminComponent } from './adminFolder/input-search-admin/search-admin.component';
import { FriendsComponent } from './adminFolder/friends/friends.component';
import { MessageComponent } from './convFolder/message/message.component';
import { SearchConvComponent } from './convFolder/search-conv/search-conv.component';
import { ConvMediasComponent } from './convFolder/conv-medias/conv-medias.component';
import { ConvSettingsComponent } from './convFolder/conv-settings/conv-settings.component';
import { MembersComponent } from './convFolder/members/members.component';
import { ResultUsersComponent } from './adminFolder/result-users/result-users.component';
import { ResultConvsComponent } from './adminFolder/result-convs/result-convs.component';
import { LoginComponent } from './indexFolder/login/login.component';
import { IndexContentComponent } from './indexFolder/index-content/index-content.component';
import { SigninComponent } from './indexFolder/signin/signin.component';
import { RegetPasswordComponent } from './indexFolder/reget-password/reget-password.component';
import { ResetPasswordComponent } from './indexFolder/reset-password/reset-password.component';
import { NotFoundPageComponent } from './indexFolder/not-found-page/not-found-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    component: IndexContentComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SigninComponent },
      { path: 'getCode', component: RegetPasswordComponent },
      { path: 'resetPassword', component: ResetPasswordComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'convs', component: ConvsAdminComponent },
      {
        path: 'search',
        component: SearchComponent,
        children: [
          { path: 'users', component: ResultUsersComponent },
          { path: 'convs', component: ResultConvsComponent },
        ],
      },

      { path: 'notifs', component: NotifsComponent },
      { path: 'friends', component: FriendsComponent },

      { path: 'profile', component: ProfileComponent },
    ],
  },

  {
    path: 'conv',
    component: ConvComponent,
    children: [
      { path: 'messages', component: MessageComponent },
      { path: 'search', component: SearchConvComponent },
      { path: 'medias', component: ConvMediasComponent },
      { path: 'settings', component: ConvSettingsComponent },
      { path: 'members', component: MembersComponent },
    ],
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
