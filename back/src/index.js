import Todoist from 'todoist-js';
import { todoist as Config } from '../config.json';

const todoist = new Todoist(Config.token);

todoist.completed.get_stats().then(stats => console.log(stats));
