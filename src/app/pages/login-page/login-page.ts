import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Autenticacao, Token } from '../../models/token.model';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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
    private autenticacaoService: AutenticacaoService,
    private router: Router,
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
      next: (dados: Token) => {
        this.autenticacaoService.setToken(dados);
        this.router.navigate(['/dashboard']); 
      },
      error: (err: HttpErrorResponse) => {
        alert(err.error);
      }
    })
  }
}
