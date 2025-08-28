import { TipoCategoria } from "../enums/tipo-categoria.enum"
import { Categoria } from "./categoria.model"

export interface Transacao {
    id: string,
    descricao: string,
    valor: number,
    data: Date,
    observacoes: string,
    categoria: Categoria
}

export interface TransacaoFiltro {
    datainicio: Date | null,
    datafim: Date | null,
    categoriaid: string | null,
    tipo: TipoCategoria | null,
}

export interface TransacaoAdicionar {
    descricao: string,
    valor: number,
    data: Date,
    categoriaid: string,
    observacoes: string | null,
}

export interface TransacaoAtualizar {
    descricao: string,
    valor: number,
    data: Date,
    categoriaid: string,
    observacoes: string,
}