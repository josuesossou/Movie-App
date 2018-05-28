import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, ActivatedRoute, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { MomentModule } from 'angular2-moment';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home-page/home/home.component';
import { SlideshowComponent } from './components/home-page/slideshow/slideshow.component';
import { MenuComponent } from './components/home-page/menu/menu.component';
import { CategoryComponent } from './components/home-page/category/category.component';
import { ChatRoomComponent } from './components/home-page/chat-room/chat-room.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DynamicHeightDirective } from './directive/dynamic-height.directive';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { SearchComponent } from './components/search/search.component';
import { LocalVideoComponent } from './components/local-video/local-video.component';
import { RemoteVideoComponent } from './components/remote-video/remote-video.component';
import { WorldChatComponent } from './components/world-chat/world-chat.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { FooterComponent } from './components/footer/footer.component';

import { LiveVideoDirective } from './directive/live-video.directive';
import { NavbarDirective } from './directive/navbar.directive';
import { ImageHeightDirective } from './directive/image-height.directive';
import { VideoWidthDirective } from './directive/video-width.directive';

// sevices
import { WebrtcService } from './services/webrtc.service';
import { ChatComponent } from './components/chat/chat.component';
import { SocketIoService } from './services/socket-io.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// lib external classes
import { ApiCalls } from './lib/api-calls';

// guards
import { AuthGuard } from './guards/auth.guard';
import { SquareAllDirective } from './directive/square-all.directive';
import { NotificationComponent } from './components/notification/notification.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'purchase/:videoId', component: PurchaseComponent, canActivate: [AuthGuard]},
  {path: 'video/:vidId', component: VideoPlayerComponent, canActivate: [AuthGuard]},
  {path: 'video/:vidId/:hostName', component: VideoPlayerComponent, canActivate: [AuthGuard]},
  {path: 'chat-room/:room_name', component: ChatComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SlideshowComponent,
    MenuComponent,
    CategoryComponent,
    ChatRoomComponent,
    NotFoundComponent,
    DynamicHeightDirective,
    NavbarComponent,
    PurchaseComponent,
    SearchComponent,
    LocalVideoComponent,
    RemoteVideoComponent,
    WorldChatComponent,
    VideoPlayerComponent,
    NavbarDirective,
    FooterComponent,
    ImageHeightDirective,
    VideoWidthDirective,
    LiveVideoDirective,
    ChatComponent,
    TimeAgoPipe,
    LoginComponent,
    RegisterComponent,
    SquareAllDirective,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    FlashMessagesModule.forRoot(),
    MomentModule
  ],
  providers: [
    WebrtcService,
    SocketIoService,
    ApiCalls,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
