import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { AsideComponent } from '../../components/aside/aside.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  imports: [
    HeaderComponent,
    AsideComponent,
    RouterOutlet
  ],
  templateUrl: './default-layout.html',
  styleUrl: './default-layout.scss'
})
export class DefaultLayout {

}
