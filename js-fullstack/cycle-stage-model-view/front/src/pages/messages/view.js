import {html as Html} from 'snabbdom-jsx';
import Style from './view.css';

export default ({user, messages}) => <section>
    <UserInput user={user} />
    <ChatBox user={user} messages={messages}/>
</section>

function UserInput({user}){
    if (user) return <app-null/>
    return <app-userinput className={Style.UserInput}>
        <input
            type="text"
            placeholder="¿quién éres?"
            value=""
        />
        <button>Enviar</button>
    </app-userinput>
}

function ChatBox({user, messages}){
    if (!user) return <app-null/>
    return <app-chatbox className={Style.ChatBox}>
        <ul>
            {messages.map(({user, message})=> <li>
                <span>{user}</span>
                <p>{message}</p>
            </li>)}
        </ul>
        <fieldset>
            <input type="hidden" name="user" value={user}/>
            <input
                placeholder="Escribe tu mensaje"
                type="text"
                name="message"
                value=""
            />
            <button>Enviar</button>
        </fieldset>
    </app-chatbox>
}
