export default function Referencer(el){
	if (!el || !el.dataset || !el.dataset.refname) return;
	this[el.dataset.refname] = el;
}