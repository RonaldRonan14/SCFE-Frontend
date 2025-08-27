import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Autenticacao, Token } from '../../models/token.model';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

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
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Credenciais válidas. Redirecionando...',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.autenticacaoService.setToken(dados);
          this.router.navigate(['/dashboard']); 
        });
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro na Autenticação',
          text: err.error || 'Ocorreu um erro desconhecido. Tente novamente.'
        });
      }
    })
  }
}
