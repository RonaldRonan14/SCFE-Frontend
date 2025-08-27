import { Component, OnInit } from '@angular/core';
import { Paginacao } from '../../models/paginacao.model';
import { Transacao, TransacaoFiltro } from '../../models/transacao.model';
import { TransacaoService } from '../../services/transacao.service';
import Swal from 'sweetalert2';
import { getDescricaoTipo, getTiposCategoriaKeys, TipoCategoria } from '../../enums/tipo-categoria.enum';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { PaginacaoComponent } from "../../components/paginacao/paginacao.component";

@Component({
  selector: 'app-transacao-page',
  imports: [
    CurrencyPipe,
    DatePipe,
    PaginacaoComponent
],
  templateUrl: './transacao-page.html',
  styleUrl: './transacao-page.scss'
})
export class TransacaoPage implements OnInit {
  paginacaoTransacao!: Paginacao<Transacao>
  tipoCategoriaEnum = TipoCategoria;
  tamanhoPaginaAtual: number = 10;
  filtro: TransacaoFiltro = {
    datainicio: new Date(new Date().getFullYear(), 0, 1),
    datafim: new Date(),
    categoriaid: null,
    tipo: null
  }
  listaCategorias!: Categoria[];

  constructor(
    private transacaoService: TransacaoService,
    private categoriaService: CategoriaService,
  ) { }

  ngOnInit(): void {
    this.carregarTransacoes(1);

    this.categoriaService.GetAll().subscribe({
      next: (dados: Categoria[]) => {
        this.listaCategorias = dados;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao obter a paginação das categorias',
          text: err.error || 'Ocorreu um erro desconhecido. Tente novamente.'
        });
      }
    })
  }

  carregarTransacoes(pagina: number): void {
    this.transacaoService.GetPagination(this.filtro, pagina, this.tamanhoPaginaAtual).subscribe({
      next: (dados: Paginacao<Transacao>) => {
        this.paginacaoTransacao = dados;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao obter a paginação das categorias',
          text: err.error || 'Ocorreu um erro desconhecido. Tente novamente.'
        });
      }
    })
  }

  filtroDatainicio(dataString: string): void {
    if (dataString.length === 0) {
      this.filtro.datainicio = new Date(new Date().getFullYear(), 0, 1)
      this.carregarTransacoes(1);
      return;
    }

    const partesDaData = dataString.split('-').map(Number);
    const data = new Date(partesDaData[0], partesDaData[1] - 1, partesDaData[2]);

    if (this.filtro.datafim && data > this.filtro.datafim) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'A data de inicio não pode ser maior que a data final'
      });
      return;
    }

    this.filtro.datainicio = data;
    this.carregarTransacoes(1);
  }

  filtroDataFim(dataString: string): void {
    if (dataString.length === 0) {
      this.filtro.datafim = new Date()
      this.carregarTransacoes(1);
      return;
    }

    const partesDaData = dataString.split('-').map(Number);
    const data = new Date(partesDaData[0], partesDaData[1] - 1, partesDaData[2]);

    if (this.filtro.datainicio && data < this.filtro.datainicio) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'A data de final não pode ser menor que a data inicial'
      });
      return;
    }

    this.filtro.datafim = data;
    this.carregarTransacoes(1);
  }

  filtroCategoria(evento: any): void {
    const categoriaId = evento.target.value;

    console.log(categoriaId)

    if (categoriaId.length == 0){
      this.filtro.categoriaid = null;
      this.carregarTransacoes(1);
      return;
    }

    this.filtro.categoriaid = categoriaId;
    this.carregarTransacoes(1);
  }

  onMudarOpcaoPaginacao(evento: { page: number, pageSize: number }): void {
    this.tamanhoPaginaAtual = evento.pageSize;
    this.carregarTransacoes(evento.page);
  }

  getDescricaoTipo(tipo: number): string {
    return getDescricaoTipo(tipo)
  }

  getTiposCategoriaKeys(): (keyof typeof TipoCategoria)[] {
    return getTiposCategoriaKeys();
  }

  getCategoriasPorTipo(tipo: keyof typeof TipoCategoria): Categoria[] {
    return this.listaCategorias.filter(f => f.tipo === this.tipoCategoriaEnum[tipo]);
  }
}
