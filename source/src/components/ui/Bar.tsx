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
import { useMediaQuery } from "react-responsive";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    startDate: Date;
    endDate: Date;
    typeTabActive: string;
}

const BarChart: React.FC<BarChartProps> = ({ startDate, endDate, typeTabActive }) => {
    const [chartData, setChartData] = useState<ChartData<"bar">>({
        labels: [],
        datasets: []
    });

    // Media queries для адаптивного изменения ширины баров
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const isTablet = useMediaQuery({ query: "(min-width: 769px) and (max-width: 1024px)" });
    const isScreen = useMediaQuery({ query: "(min-width: 1024px) and (max-width: 1500px)" });

    useEffect(() => {
        // Генерация массива дат между startDate и endDate
        const generateLabels = (start: Date, end: Date) => {
            const dates: string[] = [];
            let currentDate = start;

            while (currentDate <= end) {
                dates.push(format(currentDate, "dd.MM.yy"));
                currentDate = addDays(currentDate, 1);
            }

            return dates;
        };

        // Генерация случайных данных для примера
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
            // title: {
            //     display: true,
            //     text: "Транзакции за выбранный период",
            //     color: "#FFFFFF"
            // },
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
                    color: "rgba(179, 179, 179, 1)",
                    font: {
                        size: 12,
                        weight: 400
                    }
                },
                grid: {
                    drawOnChartArea: true,
                    color: "rgba(92, 92, 92, 1)"
                    // drawTicks: false
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

    let chartWidth = numberOfDays * (isMobile ? 40 : 60);
    if (isScreen) {
        chartWidth = Math.min(numberOfDays * 80, window.innerWidth);
    }
    return (
        <div className="bg-black mr-2 p-5 pb-0">
            <div className="overflow-x-auto scrollbar-x">
                <div style={{ width: chartWidth + "px", height: "561px" }} className="pl-[22px]">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
            {/* Кастомная легенда с круглыми элементами */}
            <div className="flex justify-center mt-3 pb-3">
                <div className="flex items-center justify-center space-x-4">
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
