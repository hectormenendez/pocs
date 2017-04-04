import Handler from 'feathers-errors/handler';

export default function Middleware(){
    const app = this;
    app.use(Handler());
}
