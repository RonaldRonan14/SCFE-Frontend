import { Component, OnInit } from '@angular/core';
import { TipoCategoria } from '../../enums/tipo-categoria.enum';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Paginacao } from '../../models/paginacao.model';
import { Categoria, CategoriaAdicionar } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-categoria-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './categoria-page.html',
  styleUrl: './categoria-page.scss'
})
export class CategoriaPage implements OnInit {
  tipoCategoriaEnum = TipoCategoria;
  adicionarCategoriaForm!: FormGroup;

  paginacaoCategoria!: Paginacao<Categoria>;

  constructor (
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
  ){}

  ngOnInit(): void {
    this.adicionarCategoriaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      tipo: [TipoCategoria.Receita, [Validators.required]]
    })

    this.categoriaService.GetPagination(1, 10)
  }

  AdicionarCategoria(): void {
    if (this.adicionarCategoriaForm.invalid)
      return;

    const categoria = this.adicionarCategoriaForm.value as CategoriaAdicionar;

    this.categoriaService.Add(categoria).subscribe({
      next: (dado: Categoria) => {
        this.paginacaoCategoria.items.push(dado);
        this.adicionarCategoriaForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        alert(err.error)
      }
    })
  }

  getTiposCategoriaKeys(): (keyof typeof TipoCategoria)[] {
    return Object.keys(this.tipoCategoriaEnum).filter(key => isNaN(Number(key))) as (keyof typeof TipoCategoria)[];
  }
}
