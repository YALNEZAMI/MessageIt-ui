import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './indexFolder/footer/footer.component';
import { IndexHeaderComponent } from './indexFolder/index-header/index-header.component';
import { IndexContentComponent } from './indexFolder/index-content/index-content.component';
import { LoginComponent } from './indexFolder/login/login.component';
import { SigninComponent } from './indexFolder/signin/signin.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './adminFolder/admin/admin.component';
import { ConvComponent } from './convFolder/conv/conv.component';
import { HeaderAdminComponent } from './adminFolder/header-admin/header-admin.component';
import { SearchAdminComponent } from './adminFolder/input-search-admin/search-admin.component';
import { ConvsAdminComponent } from './adminFolder/convs-admin/convs-admin.component';
import { SearchComponent } from './adminFolder/search/search.component';
import { ResultConvsComponent } from './adminFolder/result-convs/result-convs.component';
import { ResultUsersComponent } from './adminFolder/result-users/result-users.component';
import { FriendService } from './Services/friend.service';
import { NavBarComponent } from './adminFolder/nav-bar/nav-bar.component';
import { NotifsComponent } from './adminFolder/notifs/notifs.component';
import { ProfileComponent } from './adminFolder/profile/profile.component';
import { FriendsComponent } from './adminFolder/friends/friends.component';
import { HeaderConvComponent } from './convFolder/header-conv/header-conv.component';
import { SearchConvComponent } from './convFolder/search-conv/search-conv.component';
import { MessageComponent } from './convFolder/message/message.component';
import { ConvNavComponent } from './convFolder/conv-nav/conv-nav.component';
import { ConvSettingsComponent } from './convFolder/conv-settings/conv-settings.component';
import { ConvMediasComponent } from './convFolder/conv-medias/conv-medias.component';
import { MembersComponent } from './convFolder/members/members.component';
import { InputComponent } from './convFolder/input/input.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { env } from 'src/env';
import { RegetPasswordComponent } from './indexFolder/reget-password/reget-password.component';
import { ResetPasswordComponent } from './indexFolder/reset-password/reset-password.component';
import { NotFoundPageComponent } from './indexFolder/not-found-page/not-found-page.component';
import { ConvSideComponent } from './convFolder/conv-side/conv-side.component';
import { SearchResultComponent } from './convFolder/search-result/search-result.component';
import { GroupeComponent } from './adminFolder/groupe/groupe.component';
import { AddMemberConvComponent } from './convFolder/add-member-conv/add-member-conv.component';
import { UrlifyPipe } from './convFolder/message/urlify.pipe';
const config: SocketIoConfig = { url: env.api_url };

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    IndexHeaderComponent,
    IndexContentComponent,
    LoginComponent,
    SigninComponent,
    AdminComponent,
    ConvComponent,
    HeaderAdminComponent,
    SearchAdminComponent,
    ConvsAdminComponent,
    SearchComponent,
    ResultConvsComponent,
    ResultUsersComponent,
    NavBarComponent,
    NotifsComponent,
    ProfileComponent,
    FriendsComponent,
    HeaderConvComponent,
    SearchConvComponent,
    MessageComponent,
    ConvNavComponent,
    ConvSettingsComponent,
    ConvMediasComponent,
    MembersComponent,
    InputComponent,
    RegetPasswordComponent,
    ResetPasswordComponent,
    NotFoundPageComponent,
    ConvSideComponent,
    SearchResultComponent,
    GroupeComponent,
    AddMemberConvComponent,
    UrlifyPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [FriendService],
  bootstrap: [AppComponent],
})
export class AppModule {}
