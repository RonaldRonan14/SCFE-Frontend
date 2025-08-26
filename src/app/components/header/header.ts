import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  menuUsuario: boolean = false;

  abreMenuUsuario(): void {
    this.menuUsuario = !this.menuUsuario;
  }
}
