import { Chart } from '@antv/g2';

export const lineChart = (data:object[], target:string, x:string, y:string, colorField:string) => {
    // const chart = new Chart({
    //     container: target,
    //     autoFit: true,
    //     paddingLeft: 50,
    // });

    const chart = new Chart({
        container: target,
        autoFit: true,
        paddingLeft: 50,
        // height: window.innerHeight,
        // padding: [20, 210, 30, 50]
      });

    chart
        .line() // 创建一个 Interval 标记
        .data(data) // 绑定数据
        // .transform({ type: 'sortX', by: 'x', reverse: false })
        // .transform({ type: 'dodgeX' })
        .encode('x', x)
        .encode('y', y)
        .encode('color', colorField)
        .label({
            text: y, // 指定绑定的字段
            style: {
                fill: '#f25', // 指定样式
                dy: 5,
            },
        })
        .axis('y', { title: '↑ 二手房挂牌量 (套)' });

    // chart.scale({
    //     x: {
    //       alias: 'quantity',
    //       min: 50000,
    //       max: 200000,
    //       sync: true
    //     },
    //     y: {
    //       alias: '概率密度分布',
    //       sync: true
    //     }
    //   });

    // chart
    //     .interaction('tooltip', { shared: true })
    //     .interaction('elementHighlightByColor', { background: true });
    chart.render();
}

