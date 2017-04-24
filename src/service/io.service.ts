 abstract class IOService {

    public generateFileName() {
        let date = new Date();
        let d: string | number = date.getDate();
        d = (d < 9) ? "0" + d : String(d);

        let m: string | number = date.getMonth() + 1;
        m = (m < 9) ? "0" + m : String(m);

        let Y: number = date.getFullYear();

        let H: string | number = date.getHours();
        H = (H < 9) ? "0" + H : String(H);

        let i: string | number = date.getMinutes();
        i = (i < 9) ? "0" + i : String(i);

        return `mockitjs - ${d}-${m}-${Y} ${H}-${i}.json`;
    }
} 