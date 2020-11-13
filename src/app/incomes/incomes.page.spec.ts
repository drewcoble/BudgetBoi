import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IncomesPage } from './incomes.page';

describe('IncomesPage', () => {
  let component: IncomesPage;
  let fixture: ComponentFixture<IncomesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IncomesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
