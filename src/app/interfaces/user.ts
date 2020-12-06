import { Bill } from './bill'
import { Category } from './category';
import { Income } from './income';

export interface User {
    uid: string,
    fName: string,
    lName: string,
    email: string,
    bills?: Bill[],
    incomes?: Income[],
    categories?: Category[],
    
}