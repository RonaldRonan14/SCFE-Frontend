import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Autenticacao, Token } from '../../models/token.model';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage implements OnInit {
  autenticacaoForm!: FormGroup;
  token!: Token;

  constructor (
    private fb: FormBuilder,
    private autenticacaoService: AutenticacaoService
  ){}

  ngOnInit(): void {
    this.autenticacaoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    })
  }

  ValidaCredenciais(): void {
    if (this.autenticacaoForm.invalid)
      return;

    const autenticacao = this.autenticacaoForm.value as Autenticacao;
    this.autenticacaoService.ValidateCredentials(autenticacao).subscribe({
      next: (dados) => this.token = dados,
      error: (err) => {
        alert(err)
      }
    })
  }
}
