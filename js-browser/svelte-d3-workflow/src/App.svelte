<script>
    import { arc as Arc } from 'd3-shape';
    import { Hex } from './utils';

    /** represents the angle for a full circunference **/
    const ANGLE = Math.PI * 2;

    /** @returns {function} - A D3 shape constructor */
    const CreateArc = Arc();

    export let size = 100;
    export let data = {
        a: 9,
        b: 20,
        c: 30,
        d: 8,
        e: 12,
    };

    function handleChange(e) {
        const key = e.target.getAttribute('key');
        data = {
            ...data,
            [key]: parseInt(e.target.value, 10),
        };
    }

    /** Determine what represents 100% of the data */
    let arcs, dataTotal;
    const colors = Object.keys(data).map(() => `#${Hex(6)}`);

    /** Data coming from props converted to [{ key:string, value:any }] */
    $: dataArray = Object.entries(data).map(([key, value]) => ({ key, value }));
    $: dataTotal = dataArray.reduce((acc, { value }) => acc + value, 0);
    $: arcs = dataArray.reduce((acc, { key, value }, i) => {
        const startAngle = !i ? 0 : acc[i - 1].props.endAngle; // either 0 or the previous endAngle
        const props = {
            innerRadius: 0,
            outerRadius: size / 2,
            startAngle,
            endAngle: startAngle + ANGLE * (value / dataTotal),
        };
        return acc.concat({ fill: colors[i], d: CreateArc(props), props });
    }, []);
</script>

<style>
    main {
        height: 100%;
        background: chocolate;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }
    svg {
        background: deepskyblue;
    }
    footer {
        background: deeppink;
    }
</style>

<main>
    <svg width={size} height={size}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
            {#each arcs as arc}
                <path d={arc.d} fill={arc.fill} />
            {/each}
        </g>
    </svg>
    <footer>
        <section>
            <label>Size:</label>
            <input
                type="range"
                min={0}
                max={window.innerHeight}
                step={2}
                bind:value={size} />
            <span>{size}</span>
        </section>
        {#each dataArray as { key }}
            <section>
                <label>{key}:</label>
                <input
                    {key}
                    bind:value={data[key]}
                    type="range"
                    min={0}
                    max={dataTotal}
                    step={2}
                    on:change={handleChange} />
                <span>{data[key]}</span>
            </section>
        {/each}
    </footer>
</main>
