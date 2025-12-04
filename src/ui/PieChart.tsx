import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PieChartProps {
    name: string
    data: { name: string; value: number }[];
    colors: string[];
    refreshKey: number
}


const PieChart: React.FC<PieChartProps> = ({ name, data, colors, refreshKey }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const myChart = echarts.init(chartRef.current);

        const option = {
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    key: refreshKey,
                    name: name,
                    type: 'pie',
                    radius: ['60%', '90%'],
                    avoidLabelOverlap: false,
                    padAngle: 5,
                    itemStyle: {
                        borderRadius: 10
                    },
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    data: data.filter(item => item.value > 0),
                    color: colors
                }
            ],
            backgroundColor: 'transparent'
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [data, colors]);

    return (
        <div
            ref={chartRef}
            style={{ width: '20rem', height: '20rem' }}
            id="main"
        />
    );
};

export default PieChart;
