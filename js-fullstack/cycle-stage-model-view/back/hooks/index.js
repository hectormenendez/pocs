import Loader from '../loader';

Loader(__dirname).forEach(hook => exports[hook.name] = hook);
