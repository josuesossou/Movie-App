import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, ActivatedRoute, Routes } from '@angular/router';


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
import { NavbarDirective } from './directive/navbar.directive';
import { FooterComponent } from './components/footer/footer.component';
import { Route } from '@angular/compiler/src/core';
import { ImageHeightDirective } from './directive/image-height.directive';
import { VideoWidthDirective } from './directive/video-width.directive';
import { LiveVideoDirective } from './directive/live-video.directive';
import { WebrtcService } from './services/webrtc.service';


const routes:Routes = [
  {path: '', component:HomeComponent},
  {path: 'purchase/:videoId', component:PurchaseComponent},
  {path: 'video', component:VideoPlayerComponent},
  {path: '**', component:NotFoundComponent}
]

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
    LiveVideoDirective
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [WebrtcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
