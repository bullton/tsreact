import { Chart } from '@antv/g2';

export const intervalChart = (data:object[], target:string, x:string, y:string, colorField:string) => {
    const chart = new Chart({
        container: target,
        autoFit: true,
        paddingLeft: 50,
    });

    chart
        .interval() // 创建一个 Interval 标记
        .data(data) // 绑定数据
        .transform({ type: 'sortX', by: 'x', reverse: false })
        .transform({ type: 'dodgeX' })
        .encode('x', x)
        .encode('y', y)
        .encode('color', colorField)
        .label({
            text: y, // 指定绑定的字段
            style: {
                fill: '#fff', // 指定样式
                dy: 5,
            },
        })
        .axis('y', { labelFormatter: '~s' });

    chart
        .interaction('tooltip', { shared: true })
        .interaction('elementHighlightByColor', { background: true });
    chart.render();
}

