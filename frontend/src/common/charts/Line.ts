import { Chart } from '@antv/g2';

export const lineChart = (data:object[], target:string, x:string, y:string, colorField:string) => {
    const chart = new Chart({
        container: target,
        autoFit: true,
        paddingLeft: 80,
        theme: 'classic'
      });

    chart
        .line() // 创建一个 Interval 标记
        .data(data) // 绑定数据
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
        .scrollbar('x', {})
        .axis('x', { title: '↑ 挂牌日期', grid: true, line: true })
        .axis('y', { title: '↑ 二手房挂牌量 (套)', line: true });
        

    chart.interaction('tooltip', {
        position: 'auto',
      });
    chart.render();
}

