import { Component, OnInit } from '@angular/core';
import { Paginacao } from '../../models/paginacao.model';
import { Transacao, TransacaoAdicionar, TransacaoAtualizar, TransacaoFiltro } from '../../models/transacao.model';
import { TransacaoService } from '../../services/transacao.service';
import Swal from 'sweetalert2';
import { getDescricaoTipo, getTiposCategoriaKeys, TipoCategoria } from '../../enums/tipo-categoria.enum';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { PaginacaoComponent } from "../../components/paginacao/paginacao.component";
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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

    if (categoriaId.length == 0) {
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

  modalAdicionarTransacao(): void {

    const categoriasHtml = this.getTiposCategoriaKeys()
      .map(tipo => {
        const categoriasPorTipo = this.getCategoriasPorTipo(tipo);
        const optionsHtml = categoriasPorTipo
          .map(categoria => `<option value="${categoria.id}">${categoria.nome}</option>`)
          .join('');
        return `<optgroup label="${this.getDescricaoTipo(this.tipoCategoriaEnum[tipo])}">${optionsHtml}</optgroup>`;
      })
      .join('');

    Swal.fire({
      title: 'Adicionar transação',
      html: `
        <form id="form-adicionar-transacao">
          <div class="mb-3 text-start">
            <label for="descricao" class="form-label">Descrição</label>
            <input id="descricao" type="text" class="form-control">
            <p id="descricao-error" class="text-danger mt-1 d-none">A descrição deve conter entre 6 a 250 caracteres.</p>
          </div>
          <div class="mb-3 text-start">
            <label for="valor" class="form-label">Valor</label>
            <input id="valor" type="number" class="form-control">
            <p id="valor-error" class="text-danger mt-1 d-none">O valor deve ser maior que zero.</p>
          </div>
          <div class="mb-3 text-start">
            <label for="data" class="form-label">Data</label>
            <input id="data" type="date" class="form-control">
            <p id="data-error-null" class="text-danger mt-1 d-none">Data obrigatória.</p>
            <p id="data-error-maior" class="text-danger mt-1 d-none">Data não pode ser maior que a data atual.</p>
          </div>
          <div class="mb-3 text-start">
            <label for="tipo" class="form-label">Observações</label>
            <select id="tipo" class="form-select">
              <option value="" selected>Categorias</option>
              ${categoriasHtml}
            </select>
            <p id="tipo-error" class="text-danger mt-1 d-none">Informe uma categoria.</p>
          </div>
          <div class="mb-3 text-start">
            <label for="obsevacoes" class="form-label">Valor</label>
            <textarea class="form-control" id="obsevacoes"></textarea>
          </div>
        </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      preConfirm: async () => {
        (document.getElementById('descricao-error') as HTMLElement).classList.add('d-none');
        (document.getElementById('valor-error') as HTMLElement).classList.add('d-none');
        (document.getElementById('data-error-null') as HTMLElement).classList.add('d-none');
        (document.getElementById('data-error-maior') as HTMLElement).classList.add('d-none');
        (document.getElementById('tipo-error') as HTMLElement).classList.add('d-none');

        const descricao = (document.getElementById('descricao') as HTMLInputElement).value.trim();
        const valor = parseFloat((document.getElementById('valor') as HTMLInputElement).value);
        const dataString = (document.getElementById('data') as HTMLInputElement).value;
        const categoriaId = (document.getElementById('tipo') as HTMLSelectElement).value;
        const obsevacoes = (document.getElementById('obsevacoes') as HTMLSelectElement).value.trim();

        if (descricao.length < 6 || descricao.length > 250) {
          (document.getElementById('descricao-error') as HTMLElement).classList.remove('d-none');
          return false;
        }

        if (valor <= 0 || isNaN(valor)) {
          (document.getElementById('valor-error') as HTMLElement).classList.remove('d-none');
          return false;
        }

        if (dataString.length == 0) {
          (document.getElementById('data-error-null') as HTMLElement).classList.remove('d-none');
          return false;
        }

        const partesDaData = dataString.split('-').map(Number);
        const data = new Date(partesDaData[0], partesDaData[1] - 1, partesDaData[2]);

        if (data > new Date()) {
          (document.getElementById('data-error-maior') as HTMLElement).classList.remove('d-none');
          return false;
        }

        if (categoriaId.length == 0) {
          (document.getElementById('tipo-error') as HTMLElement).classList.remove('d-none');
          return false;
        }

        const transacao: TransacaoAdicionar = {
          descricao: descricao,
          valor: valor,
          data: data,
          categoriaid: categoriaId,
          observacoes: obsevacoes
        }

        try {
          const dado = await firstValueFrom(this.transacaoService.Add(transacao));
          return dado;
        } catch (err: any) {
          Swal.showValidationMessage(err.error || 'Ocorreu um erro desconhecido.');
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Sucesso!',
          'A transação foi adicionada com sucesso.',
          'success'
        );

        const dado: Transacao = result.value;
        this.paginacaoTransacao.items.push(dado)
      }
    });
  }

  async modalAtualizarTransacao(id: string) {
    const transacao = await firstValueFrom(this.transacaoService.GetById(id));
    const dataObj = new Date(transacao.data);
    const ano = dataObj.getFullYear();
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const categoriasHtml = this.getTiposCategoriaKeys()
      .map(tipo => {
        const categoriasPorTipo = this.getCategoriasPorTipo(tipo);
        const optionsHtml = categoriasPorTipo
          .map(categoria => {
            const selected = categoria.id === transacao.categoria.id ? 'selected' : '';
            return `<option value="${categoria.id}" ${selected}>${categoria.nome}</option>`
          })
          .join('');
        return `<optgroup label="${this.getDescricaoTipo(this.tipoCategoriaEnum[tipo])}">${optionsHtml}</optgroup>`;
      })
      .join('');

    Swal.fire({
      title: 'Adicionar transação',
      html: `
        <form id="form-adicionar-transacao">
          <div class="mb-3 text-start">
            <label for="descricao" class="form-label">Descrição</label>
            <input id="descricao" type="text" class="form-control" value="${transacao.descricao}">
            <p id="descricao-error" class="text-danger mt-1 d-none">A descrição deve conter entre 6 a 250 caracteres.</p>
          </div>
          <div class="mb-3 text-start">
            <label for="valor" class="form-label">Valor</label>
            <input id="valor" type="number" class="form-control" value="${transacao.valor}">
            <p id="valor-error" class="text-danger mt-1 d-none">O valor deve ser maior que zero.</p>
          </div>
          <div class="mb-3 text-start">
            <label for="data" class="form-label">Data</label>
            <input id="data" type="date" class="form-control" value="${dataFormatada}">
            <p id="data-error-null" class="text-danger mt-1 d-none">Data obrigatória.</p>
            <p id="data-error-maior" class="text-danger mt-1 d-none">Data não pode ser maior que a data atual.</p>
          </div>
          <div class="mb-3 text-start">
            <label for="tipo" class="form-label">Observações</label>
            <select id="tipo" class="form-select">
              <option value="" selected>Categorias</option>
              ${categoriasHtml}
            </select>
            <p id="tipo-error" class="text-danger mt-1 d-none">Informe uma categoria.</p>
          </div>
          <div class="mb-3 text-start">
            <label for="obsevacoes" class="form-label">Valor</label>
            <textarea class="form-control" id="obsevacoes">${transacao.observacoes}</textarea>
          </div>
        </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      preConfirm: async () => {
        (document.getElementById('descricao-error') as HTMLElement).classList.add('d-none');
        (document.getElementById('valor-error') as HTMLElement).classList.add('d-none');
        (document.getElementById('data-error-null') as HTMLElement).classList.add('d-none');
        (document.getElementById('data-error-maior') as HTMLElement).classList.add('d-none');
        (document.getElementById('tipo-error') as HTMLElement).classList.add('d-none');

        const descricao = (document.getElementById('descricao') as HTMLInputElement).value.trim();
        const valor = parseFloat((document.getElementById('valor') as HTMLInputElement).value);
        const dataString = (document.getElementById('data') as HTMLInputElement).value;
        const categoriaId = (document.getElementById('tipo') as HTMLSelectElement).value;
        const obsevacoes = (document.getElementById('obsevacoes') as HTMLSelectElement).value.trim();

        if (descricao.length < 6 || descricao.length > 250) {
          (document.getElementById('descricao-error') as HTMLElement).classList.remove('d-none');
          return false;
        }

        if (valor <= 0 || isNaN(valor)) {
          (document.getElementById('valor-error') as HTMLElement).classList.remove('d-none');
          return false;
        }

        if (dataString.length == 0) {
          (document.getElementById('data-error-null') as HTMLElement).classList.remove('d-none');
          return false;
        }

        const partesDaData = dataString.split('-').map(Number);
        const data = new Date(partesDaData[0], partesDaData[1] - 1, partesDaData[2]);

        if (data > new Date()) {
          (document.getElementById('data-error-maior') as HTMLElement).classList.remove('d-none');
          return false;
        }

        if (categoriaId.length == 0) {
          (document.getElementById('tipo-error') as HTMLElement).classList.remove('d-none');
          return false;
        }

        const transacao: TransacaoAtualizar = {
          descricao: descricao,
          valor: valor,
          data: data,
          categoriaid: categoriaId,
          observacoes: obsevacoes
        }

        try {
          const dado = await firstValueFrom(this.transacaoService.Update(id, transacao));
          return dado;
        } catch (err: any) {
          Swal.showValidationMessage(err.error || 'Ocorreu um erro desconhecido.');
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Sucesso!',
          'A transação foi alterada com sucesso.',
          'success'
        );

        const dado: Transacao = result.value;
        const index = this.paginacaoTransacao.items.findIndex(i => i.id === dado.id);
        if (index !== -1) {
          this.paginacaoTransacao.items[index] = dado;
        }
      }
    });
  }

  modalRemoverTransacao(id: string): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transacaoService.Remove(id).subscribe({
          next: () => {
            this.paginacaoTransacao.items = this.paginacaoTransacao.items.filter(t => t.id !== id);

            Swal.fire(
              'Deletado!',
              'A transação foi deletada com sucesso.',
              'success'
            );
          },
          error: (err: HttpErrorResponse) => {
            Swal.fire(
              'Erro!',
              err.error || 'Ocorreu um erro ao deletar a transação.',
              'error'
            );
          }
        });
      }
    });
  }
}
