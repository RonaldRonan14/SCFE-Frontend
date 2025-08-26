import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Aside } from '../../components/aside/aside';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  imports: [
    Header,
    Aside,
    RouterOutlet
  ],
  templateUrl: './default-layout.html',
  styleUrl: './default-layout.scss'
})
export class DefaultLayout {

}
