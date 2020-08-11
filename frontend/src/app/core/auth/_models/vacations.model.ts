export class vacation {
    title: string;
    date: Date;
    indexDay: number;
    vacationID: number;

    clear() {
        this.title = '';
        this.date = new Date();
        this.indexDay = 0;
        this.vacationID = 0;
    }
}
