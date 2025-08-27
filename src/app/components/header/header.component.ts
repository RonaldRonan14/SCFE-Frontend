import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  menuUsuario: boolean = false;
  nome: string | null = null;
  email: string | null = null;

  constructor(
    private autenticacaoService: AutenticacaoService
  ){}

  ngOnInit(): void {
    this.nome = this.autenticacaoService.getNomeUsuario();
    this.email = this.autenticacaoService.getEmailUsuario();
  }

  abreMenuUsuario(): void {
    this.menuUsuario = !this.menuUsuario;
  }

  logout(): void {
    console.log('sair')
    this.autenticacaoService.logout();
  }
}
