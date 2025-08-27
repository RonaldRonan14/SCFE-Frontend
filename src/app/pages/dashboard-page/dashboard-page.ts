import { Component, OnInit } from '@angular/core';
import { Transacao, TransacaoFiltro } from '../../models/transacao.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Paginacao } from '../../models/paginacao.model';
import { TransacaoService } from '../../services/transacao.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit {
  filtroForm!: FormGroup;
  transacaoPaginada!: Paginacao<Transacao>;

  constructor(
    private fb: FormBuilder,
    private transacaoService: TransacaoService,
  ){}
  
  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      datainicio: [new Date(new Date().getFullYear(), 0, 1)],
      datafim: [new Date()],
      categoriaid: [null]
    })

    this.CarregarTransacoes();

    console.log(this.transacaoPaginada)
  }

  private CarregarTransacoes(): void{
    const filtro = this.filtroForm.value as TransacaoFiltro;
    this.transacaoService.GetPagination(filtro, 1, 10).subscribe({
      next: (dados) => this.transacaoPaginada = dados,
      error: (err) => {
        console.error(err)
      }
    })
  }
}
