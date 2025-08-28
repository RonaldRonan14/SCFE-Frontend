import { Component, OnInit } from '@angular/core';
import { TipoCategoria, getDescricaoTipo, getTiposCategoriaKeys } from '../../enums/tipo-categoria.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { Paginacao } from '../../models/paginacao.model';
import { Categoria, CategoriaAdicionar, CategoriaAtualizar, CategoriaFiltro } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginacaoComponent } from "../../components/paginacao/paginacao.component";

@Component({
  selector: 'app-categoria-page',
  imports: [
    ReactiveFormsModule,
    PaginacaoComponent
  ],
  templateUrl: './categoria-page.html',
  styleUrl: './categoria-page.scss'
})
export class CategoriaPage implements OnInit {
  tipoCategoriaEnum = TipoCategoria;
  tamanhoPaginaAtual: number = 10;
  paginacaoCategoria!: Paginacao<Categoria>;
  filtro: CategoriaFiltro = {
    nome: null,
    tipo: null
  };

  constructor(
    private categoriaService: CategoriaService,
  ) { }

  ngOnInit(): void {
    this.carregarCategorias(1);
  }

  carregarCategorias(pagina: number): void {
    this.categoriaService.GetPagination(this.filtro, pagina, this.tamanhoPaginaAtual).subscribe({
      next: (dados: Paginacao<Categoria>) => {
        this.paginacaoCategoria = dados;
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao obter a paginação das categorias',
          text: err.error || 'Ocorreu um erro desconhecido. Tente novamente.'
        });
      }
    });
  }

  onMudarOpcaoPaginacao(evento: { page: number, pageSize: number }): void {
    this.tamanhoPaginaAtual = evento.pageSize;
    this.carregarCategorias(evento.page);
  }

  getDescricaoTipo(tipo: number): string {
    return getDescricaoTipo(tipo)
  }

  filtrarCategoriaPorNome(nome: string): void {
    if (nome.trim().length == 0) {
      this.filtro.nome = null;
      this.carregarCategorias(1);
      return;
    }

    if (nome.trim().length <= 3) {
      return;
    }

    this.filtro.nome = nome;
    this.carregarCategorias(1);
  }

  filtrarCategoriaPorTipo(event: any): void {
    const tipo = parseInt(event.target.value, 0);
    if (tipo == 0) {
      this.filtro.tipo = null;
      this.carregarCategorias(1);
    }

    this.filtro.tipo = tipo;
    this.carregarCategorias(1);
  }

  modalAdicionarCategoria(): void {
    Swal.fire({
      title: 'Adicionar categoria',
      html: `
      <form id="form-adicionar-categoria">
        <div class="mb-3 text-start">
          <label for="nome" class="form-label">Nome</label>
          <input id="nome" type="text" class="form-control">
          <p id="nome-error" class="text-danger mt-1 d-none">O nome deve conter entre 6 a 50 caracteres.</p>
        </div>
        <div class="mb-3 text-start">
          <label for="tipo" class="form-label">Tipo</label>
          <select id="tipo" class="form-select">
            ${this.getTiposCategoriaKeys()
          .map(tipo => `<option value="${this.tipoCategoriaEnum[tipo]}">${tipo}</option>`)
          .join('')
        }
          </select>
          <p id="tipo-error" class="text-danger mt-1 d-none">O tipo informado é invalido.</p>
        </div>
      </form>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      preConfirm: async () => {
        (document.getElementById('nome-error') as HTMLElement).classList.add('d-none');
        (document.getElementById('tipo-error') as HTMLElement).classList.add('d-none');

        const nome = (document.getElementById('nome') as HTMLInputElement).value.trim();
        const tipoValue = (document.getElementById('tipo') as HTMLSelectElement).value;

        if (nome.length < 6 || nome.length > 50) {
          (document.getElementById('nome-error') as HTMLElement).classList.remove('d-none');
          return false;
        }

        if (!tipoValue || isNaN(Number(tipoValue))) {
          (document.getElementById('tipo-error') as HTMLElement).classList.remove('d-none');
          return false;
        }

        const categoria: CategoriaAdicionar = {
          nome,
          tipo: Number(tipoValue)
        };

        try {
          const dado = await firstValueFrom(this.categoriaService.Add(categoria));
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
          'A categoria foi adicionada com sucesso.',
          'success'
        );
        const dado: Categoria = result.value;
        this.paginacaoCategoria.items.push(dado)
      }
    });
  }

  async modalAtualizarCategoria(id: string) {
    let categoria = await firstValueFrom(this.categoriaService.GetById(id));

    const opcoesSelect = this.getTiposCategoriaKeys()
      .map(tipo => {
        const valor = this.tipoCategoriaEnum[tipo];
        const selected = valor === categoria.tipo ? 'selected' : '';
        return `<option value="${valor}" ${selected}>${tipo}</option>`;
      })
      .join('');

    Swal.fire({
      title: 'Atualizar categoria',
      html: `
      <form id="form-adicionar-categoria">
        <div class="mb-3 text-start">
          <label for="nome" class="form-label">Nome</label>
          <input id="nome" type="text" class="form-control" value='${categoria.nome}'>
          <p id="nome-error" class="text-danger mt-1 d-none">O nome deve conter entre 6 a 50 caracteres.</p>
        </div>
        <div class="mb-3 text-start">
          <label for="tipo" class="form-label">Tipo</label>
          <select id="tipo" class="form-select">
            ${opcoesSelect}
          </select>
          <p id="tipo-error" class="text-danger mt-1 d-none">O tipo informado é invalido.</p>
        </div>
        <div class="text-start">
          <label for="ativo" class="form-label">Ativo</label>
          <input type="checkbox" id="ativo" class="form-check" ${categoria.ativo ? 'checked' : ''}>
        <div/>
      </form>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      preConfirm: async () => {
        (document.getElementById('nome-error') as HTMLElement).classList.add('d-none');
        (document.getElementById('tipo-error') as HTMLElement).classList.add('d-none');

        const nome = (document.getElementById('nome') as HTMLInputElement).value.trim();
        const tipoValue = (document.getElementById('tipo') as HTMLSelectElement).value;
        const ativo = (document.getElementById('ativo') as HTMLInputElement).checked;

        if (nome.length < 6 || nome.length > 50) {
          (document.getElementById('nome-error') as HTMLElement).classList.remove('d-none');
          return false;
        }

        if (!tipoValue || isNaN(Number(tipoValue))) {
          (document.getElementById('tipo-error') as HTMLElement).classList.remove('d-none');
          return false;
        }

        const categoria: CategoriaAtualizar = {
          nome,
          tipo: Number(tipoValue),
          ativo: ativo
        };

        try {
          const dado = await firstValueFrom(this.categoriaService.Update(id, categoria));
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
          'A categoria foi atualizada com sucesso.',
          'success'
        );

        const dado: Categoria = result.value;
        const index = this.paginacaoCategoria.items.findIndex(i => i.id === dado.id);
        if (index !== -1) {
          this.paginacaoCategoria.items[index] = dado;
        }
      }
    });
  }

  getTiposCategoriaKeys(): (keyof typeof TipoCategoria)[] {
    return getTiposCategoriaKeys();
  }
}
