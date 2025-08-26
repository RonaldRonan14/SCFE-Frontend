import { Categoria } from "./categoria.model";
import { Transacao } from "./transacao.model";

export interface RelatorioResumo {
    saldototal: number,
    receitas: number,
    despesas: number,
    transacoes: Transacao[],
}

export interface RelatorioPorCategoria {
    saldototal: number,
    categoria: Categoria[],
}

export interface RelatorioFiltro {
    datainicio: Date,
    datafim: Date,
}