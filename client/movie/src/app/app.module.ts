import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home-page/home/home.component';
import { SlideshowComponent } from './components/home-page/slideshow/slideshow.component';
import { MenuComponent } from './components/home-page/menu/menu.component';
import { CategoryComponent } from './components/home-page/category/category.component';
import { ChatRoomComponent } from './components/home-page/chat-room/chat-room.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DynamicHeightDirective } from './directive/dynamic-height.directive';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SlideshowComponent,
    MenuComponent,
    CategoryComponent,
    ChatRoomComponent,
    NotFoundComponent,
    DynamicHeightDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
