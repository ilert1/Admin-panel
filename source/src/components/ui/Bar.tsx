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
    typeTabActive: string;
    open: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ startDate, endDate, typeTabActive, open }) => {
    const [chartData, setChartData] = useState<ChartData<"bar">>({
        labels: [],
        datasets: []
    });

    const [isChartVisible, setIsChartVisible] = useState(open); // Для отображения компонента
    const [isClosing, setIsClosing] = useState(false); // Для анимации закрытия

    useEffect(() => {
        if (open) {
            setIsChartVisible(true);
            setIsClosing(false); // Убираем флаг закрытия, если компонент открыт
        } else {
            setIsClosing(true); // Включаем анимацию закрытия
            setTimeout(() => setIsChartVisible(false), 500); // Удаляем график после анимации
        }
    }, [open]);

    useEffect(() => {
        const generateLabels = (start: Date, end: Date) => {
            const dates: string[] = [];
            let currentDate = start;
            while (currentDate <= end) {
                dates.push(format(currentDate, "dd.MM.yy"));
                currentDate = addDays(currentDate, 1);
            }
            return dates;
        };

        const generateRandomData = (length: number) => {
            return Array.from({ length }, () => Math.floor(Math.random() * 50));
        };

        const labels = generateLabels(startDate, endDate);
        let newChartData = null;
        switch (typeTabActive) {
            case "Deposit":
                newChartData = {
                    labels,
                    datasets: [
                        {
                            label: "Пополнение",
                            data: generateRandomData(labels.length),
                            backgroundColor: "#008C99",
                            borderColor: "#008C99",
                            borderWidth: 1
                        }
                    ]
                };
                break;
            case "Withdraw":
                newChartData = {
                    labels,
                    datasets: [
                        {
                            label: "Вывод средств",
                            data: generateRandomData(labels.length),
                            backgroundColor: "#57CD8C",
                            borderColor: "#57CD8C",
                            borderWidth: 1
                        }
                    ]
                };
                break;
            case "Reward":
                newChartData = {
                    labels,
                    datasets: [
                        {
                            label: "Выплата вознаграждения",
                            data: generateRandomData(labels.length),
                            backgroundColor: "#D8F3E4",
                            borderColor: "#D8F3E4",
                            borderWidth: 1
                        }
                    ]
                };
                break;
            default:
                newChartData = {
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
                break;
        }

        setChartData(newChartData);
    }, [startDate, endDate, typeTabActive]);

    const options: ChartOptions<"bar"> = {
        animation: {
            duration: 1000,
            easing: "easeOutBounce"
        },
        datasets: {
            bar: {
                barThickness: "flex",
                barPercentage: typeTabActive ? (typeTabActive === "Transfer" ? 0.8 : 0.4) : 0.8
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                displayColors: false
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: "rgba(179, 179, 179, 1)",
                    font: {
                        size: 12,
                        weight: 400
                    }
                },
                grid: {
                    drawOnChartArea: true,
                    color: "rgba(92, 92, 92, 1)"
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "rgba(179, 179, 179, 1)",
                    font: {
                        size: 12,
                        weight: 400
                    },
                    callback(tickValue, index, ticks) {
                        if (index === ticks.length - 1) return "USDT";
                        return tickValue;
                    }
                },
                grid: {
                    drawOnChartArea: true,
                    color: "rgba(92, 92, 92, 1)",
                    drawTicks: false
                },
                display: "auto"
            }
        }
    };

    const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const chartWidth = numberOfDays * 100;

    if (!isChartVisible) {
        return null; // Полностью удаляем элемент из DOM
    }

    return (
        <div className={`bg-black mr-2 p-5 pb-0 ${isClosing ? "fade-out-up" : "fade-in-down"}`}>
            <div className="overflow-x-auto scrollbar-x">
                <div style={{ width: chartWidth + "px", height: "561px" }} className="pl-[22px]">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
            {/* Кастомная легенда с круглыми элементами */}
            <div className="flex justify-center mt-3 pb-3">
                <div className="flex flex-col sm:flex-row items-center justify-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-12 h-5 rounded-full bg-[#008C99]" />
                        <span className="text-white ml-2">Пополнение</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-12 h-5 rounded-full bg-[#57CD8C]" />
                        <span className="text-white ml-2">Вывод средств</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-12 h-5 rounded-full bg-[#D8F3E4]" />
                        <span className="text-white ml-2">Выплата вознаграждения</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarChart;
