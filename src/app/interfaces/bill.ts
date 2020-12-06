export interface Bill {
    id?: string,
    uid?: string,
    name: string,
    amount: number,
    dueDate: number,
    isChecked?: boolean,
}