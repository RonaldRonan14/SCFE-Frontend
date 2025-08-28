import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paginacao } from '../../models/paginacao.model';

@Component({
  selector: 'app-paginacao',
  imports: [],
  templateUrl: './paginacao.component.html',
  styleUrl: './paginacao.component.scss'
})
export class PaginacaoComponent {
  @Input() paginacao!: Paginacao<any>;
  @Output() opcaoPaginacao = new EventEmitter<{
    page: number, 
    pageSize: number
  }>();
  listaTamanhoPagina: number[] = [10, 25, 50, 100];

  get paginasArray(): number[] {
    if (!this.paginacao) {
      return [];
    }
    return Array.from({ length: this.paginacao.totalPaginas }, (_, i) => i + 1);
  }

  onMudarPagina(pagina: number): void {
    if (
      pagina !== this.paginacao.paginaAtual &&
      pagina > 0 &&
      pagina <= this.paginacao.totalPaginas
    ) {
      this.opcaoPaginacao.emit({
        page: pagina,
        pageSize: this.paginacao.tamanhoPagina,
      });
    }
  }

  onMudarTamanhoPagina(event: any): void {
    const novoTamanho = parseInt(event.target.value, 10);
    this.opcaoPaginacao.emit({
      page: 1,
      pageSize: novoTamanho,
    });
  }
}
