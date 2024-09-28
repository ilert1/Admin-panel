import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData
} from "chart.js";
import "chartjs-adapter-date-fns";
import { addDays, format } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    startDate: Date;
    endDate: Date;
}

const BarChart: React.FC<BarChartProps> = ({ startDate, endDate }) => {
    const [chartData, setChartData] = useState<ChartData<"bar">>({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        // Генерация массива дат между startDate и endDate
        const generateLabels = (start: Date, end: Date) => {
            const dates: string[] = [];
            let currentDate = start;

            while (currentDate <= end) {
                dates.push(format(currentDate, "yyyy-MM-dd"));
                currentDate = addDays(currentDate, 1);
            }

            return dates;
        };

        // Генерация случайных данных для примера
        const generateRandomData = (length: number) => {
            return Array.from({ length }, () => Math.floor(Math.random() * 5000));
        };

        const labels = generateLabels(startDate, endDate);

        const newChartData = {
            labels,
            datasets: [
                {
                    label: "Пополнение",
                    data: generateRandomData(labels.length),
                    backgroundColor: "#008C99",
                    borderColor: "#008C99",
                    borderWidth: 1
                },
                {
                    label: "Вывод средств",
                    data: generateRandomData(labels.length),
                    backgroundColor: "#57CD8C",
                    borderColor: "#57CD8C",
                    borderWidth: 1
                },
                {
                    label: "Выплата вознаграждения",
                    data: generateRandomData(labels.length),
                    backgroundColor: "#D8F3E4",
                    borderColor: "#D8F3E4",
                    borderWidth: 1
                }
            ]
        };

        setChartData(newChartData);
    }, [startDate, endDate]);

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false, // Для точной настройки высоты
        plugins: {
            legend: {
                display: false // Отключаем встроенную легенду, создаем свою
            },
            title: {
                display: true,
                text: "Транзакции за выбранный период",
                color: "#FFFFFF" // Белый текст для заголовка
            },
            tooltip: {
                callbacks: {
                    labelColor: () => ({
                        borderColor: "#000000",
                        backgroundColor: "#000000"
                    })
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: "#FFFFFF", // Белый цвет для подписей оси X
                    maxRotation: 90,
                    minRotation: 45
                },
                grid: {
                    display: false // Сетка по оси X отключена
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#FFFFFF" // Белый цвет для подписей оси Y
                },
                grid: {
                    drawOnChartArea: false // Ценовые линии остаются фиксированными
                }
            }
        },
        elements: {
            bar: {
                barThickness: 26 // Ширина баров 26px
            }
        }
    };

    // Рассчитываем минимальную ширину для графика
    const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const chartWidth = numberOfDays * 80; // 80px на день, чтобы были места для трех баров и отступов

    return (
        <div className="w-full bg-black">
            <div className="overflow-x-auto w-full">
                {/* Устанавливаем динамическую ширину графика */}
                <div style={{ width: chartWidth + "px", height: "561px" }}>
                    <Bar data={chartData} options={options} />
                </div>
            </div>
            {/* Кастомная легенда с круглыми элементами */}
            <div className="flex justify-center mt-3 pb-3">
                <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-12 h-5 rounded-full bg-[#008C99]" /> {/* Округленный элемент */}
                        <span className="text-white ml-2">Пополнение</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-12 h-5 rounded-full bg-[#57CD8C]" /> {/* Округленный элемент */}
                        <span className="text-white ml-2">Вывод средств</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-12 h-5 rounded-full bg-[#D8F3E4]" /> {/* Округленный элемент */}
                        <span className="text-white ml-2">Выплата вознаграждения</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarChart;
