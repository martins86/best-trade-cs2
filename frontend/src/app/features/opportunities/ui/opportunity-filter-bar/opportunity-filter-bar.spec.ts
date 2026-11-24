import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OpportunityListPage } from '../../pages/opportunity-list.page';

function createFixture() {
  TestBed.configureTestingModule({ imports: [OpportunityListPage] });
  const fixture = TestBed.createComponent(OpportunityListPage);
  fixture.detectChanges();
  return fixture;
}

function setInput(element: HTMLInputElement, value: string): void {
  element.value = value;
  element.dispatchEvent(new Event('input'));
}

function setSelect(element: HTMLSelectElement, value: string): void {
  element.value = value;
  element.dispatchEvent(new Event('change'));
}

describe('Opportunity filter controls', () => {
  it('combina os controles de busca, direção, liquidez e margem', () => {
    const fixture = createFixture();
    const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    const selects = fixture.nativeElement.querySelectorAll('select') as NodeListOf<HTMLSelectElement>;
    const inputs = fixture.nativeElement.querySelectorAll('input[type="number"]') as NodeListOf<HTMLInputElement>;

    setInput(search, 'AK');
    setSelect(selects[0], 'steam-to-csfloat');
    setSelect(selects[1], 'medium');
    setInput(inputs[0], '0');

    fixture.detectChanges();

    expect(fixture.componentInstance.filter().search).toBe('AK');
    expect(fixture.componentInstance.filter().direction).toBe('steam-to-csfloat');
    expect(fixture.componentInstance.filter().liquidityMin).toBe('medium');
    expect(fixture.componentInstance.filter().marginMin).toBe(0);
  });

  it('informa faixa de custo invertida e não apresenta resultados filtrados', () => {
    const fixture = createFixture();
    const inputs = fixture.nativeElement.querySelectorAll('input[type="number"]') as NodeListOf<HTMLInputElement>;

    setInput(inputs[1], '600');
    setInput(inputs[2], '500');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent)
      .toContain('Custo mínimo não pode ser maior');
    expect(fixture.componentInstance.visibleScenarios()).toHaveLength(0);
  });

  it('apresenta estado vazio e limpa todos os filtros pela ação da interface', () => {
    const fixture = createFixture();
    const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;

    setInput(search, 'skin inexistente');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nenhum resultado correspondente');
    const clearButton = fixture.nativeElement.querySelector('.empty-state button') as HTMLButtonElement;
    clearButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.filter().search).toBe('');
    expect(fixture.componentInstance.visibleScenarios().length).toBeGreaterThan(0);
  });
});
