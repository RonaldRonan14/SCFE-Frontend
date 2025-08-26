import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [
    RouterLink
  ],
  templateUrl: './aside.html',
  styleUrl: './aside.scss'
})
export class Aside {
  subMenuStates: { [key: string]: boolean } = {};

  menuItems = [
    { label: 'Dashboard', link: '/dashboard', icon: 'bi bi-columns-gap' },
    { label: 'Transaçoes', link: '/transacao', icon: 'bi bi-bank' },
    {
      label: 'Configurações',
      icon: 'bi bi-gear',
      id: 'configuracoes',
      subItems: [
        { label: 'Categorias', link: '/configuracao/categoria', icon: 'bi bi-tags' },
      ]
    },
    {
      label: 'Relatórios',
      icon: 'bi bi-clipboard2-data',
      id: 'relatorios',
      subItems: [
        { label: 'Transações por categoria', link: '/relatorio/transacao-por-categoria', icon: 'bi bi-bar-chart' },
      ]
    }
  ];

  constructor() {
    this.menuItems.forEach(item => {
      if (item.subItems && item.id) {
        this.subMenuStates[item.id] = false;
      }
    });
  }

  abrirSubMenu(id: string): void {
    this.subMenuStates[id] = !this.subMenuStates[id];
  }

  fecharTodosSubMenus(): void {
    for (const key in this.subMenuStates) {
      if (this.subMenuStates.hasOwnProperty(key)) {
        this.subMenuStates[key] = false;
      }
    }
  }

  isSubMenuOpen(id: string): boolean {
    return this.subMenuStates[id];
  }
}
