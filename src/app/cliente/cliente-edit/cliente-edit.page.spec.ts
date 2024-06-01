import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClienteEditPage } from './cliente-edit.page';

describe('ClienteEditPage', () => {
  let component: ClienteEditPage;
  let fixture: ComponentFixture<ClienteEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
