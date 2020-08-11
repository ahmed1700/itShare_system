export class Track {
    trackID: number;
    trackName: string;
    trackOutline: string;
    trackHours: number;
    price: number;
    clear() {
        this.trackID = 0;
        this.trackName = '';
        this.trackOutline = '';
        this.trackHours = 0;
        this.price = 0;
    }
}