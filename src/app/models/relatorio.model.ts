import { Categoria } from "./categoria.model";
import { Transacao } from "./transacao.model";

export interface RelatorioResumo {
    saldoTotal: number,
    receitas: number,
    despesas: number,
    transacoes: Transacao[],
}

export interface RelatorioPorCategoria {
    saldoTotal: number,
    categoria: Categoria,
}

export interface RelatorioFiltro {
    datainicio: Date,
    datafim: Date,
}