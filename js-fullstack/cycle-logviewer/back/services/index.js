import Logs from './logs';
import Github from './github';

export default function Services(){
    this.configure(Logs);
    this.configure(Github);
}
