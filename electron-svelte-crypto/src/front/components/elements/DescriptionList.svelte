<script>
    export const NAME = "DescriptionList";

    export let items = [];

    function handleClick(e) {
        const { target } = e;
        if (target.hasAttribute("data-expanded")) {
            target.removeAttribute("data-expanded");
        } else {
            target.setAttribute("data-expanded", true);
        }
    }
</script>

<component name={NAME}>
    <dl>
        {#each items as { title, description }}
            <dt on:click={handleClick}>
                <slot name="title" {title}>{title}</slot>
            </dt>
            <dd>
                <slot name="description" {description}>{description}</slot>
            </dd>
        {/each}
    </dl>
</component>

<style>
    component {
        background: deeppink;
    }
    dl,
    dd,
    dt {
        user-select: none;
    }
    dd {
        overflow: hidden;
        background: lightgrey;
    }
    dt {
        cursor: pointer;
        position: relative;
        background: dodgerblue;
        padding: 0.25em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    dt:after {
        display: block;
        position: absolute;
        right: 0.25em;
        top: 0.25em;
        margin-left: 1em;
        content: "▲";
        color: rgba(0, 0, 139, 0.5);
    }
    dt:not([data-expanded]) + dd {
        height: 0;
    }

    dt:not([data-expanded]):after {
        content: "▼";
    }
    dt[data-expanded] + dd {
        height: auto;
    }
</style>
