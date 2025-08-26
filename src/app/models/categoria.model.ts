import { TipoCategoria } from "../enums/tipo-categoria.enum";

export interface Categoria {
    id: string,
    nome: string,
    tipo: TipoCategoria,
    ativo: boolean,
}

export interface CategoriaAdicionar {
    nome: string,
    tipo: TipoCategoria,
}

export interface CategoriaAtualizar {
    nome: string,
    tipo: TipoCategoria,
    ativo: boolean,
}