import Loader from '../loader';

const services = Loader(__dirname);

export default function Services(){
    services.forEach(service => this.configure(service));
}
