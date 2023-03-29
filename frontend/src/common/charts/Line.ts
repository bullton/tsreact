import { Chart } from '@antv/g2';

export const lineChart = (data:object[], target:string, x:string, y:string, colorField:string) => {
    const chart = new Chart({
        container: target,
        autoFit: true,
        paddingLeft: 50,
        theme: 'classic'
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
            transform: [{ type: 'overlapDodgeY' }],
            style: {
                fontSize: 10,
                dy: -5
            }
        })
        .axis('y', { title: '↑ 二手房挂牌量 (套)' });
        

    chart.interaction('tooltip', {
        // 设置 Tooltip 的位置，为 'auto' 时会自动调整 Tooltip 使其不会超出图表区域
        position: 'auto',
      });
    chart.render();
}

