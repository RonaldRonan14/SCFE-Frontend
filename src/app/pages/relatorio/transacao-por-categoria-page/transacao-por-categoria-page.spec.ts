import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacaoPorCategoriaPage } from './transacao-por-categoria-page';

describe('TransacaoPorCategoriaPage', () => {
  let component: TransacaoPorCategoriaPage;
  let fixture: ComponentFixture<TransacaoPorCategoriaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransacaoPorCategoriaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransacaoPorCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
