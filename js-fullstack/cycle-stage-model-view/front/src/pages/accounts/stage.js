import Navigation from '../../components/navigation';

export default function Stage(source){
    const component = {};
    component.navigation = Navigation(source);

    return { component };
}
