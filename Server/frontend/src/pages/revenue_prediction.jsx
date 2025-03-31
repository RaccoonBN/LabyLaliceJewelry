import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './revenue_prediction.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const RevenuePrediction = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [previousMonthRevenue, setPreviousMonthRevenue] = useState('');
    const [predictedRevenue, setPredictedRevenue] = useState(null);
    const [actualRevenue, setActualRevenue] = useState(null);
    const [error, setError] = useState(null);
    const [actualRevenueError, setActualRevenueError] = useState(null);
    const [previousMonthRevenueError, setPreviousMonthRevenueError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formattedPreviousMonthRevenue, setFormattedPreviousMonthRevenue] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchActualRevenue = async () => {
            setLoading(true);
            setError(null);
            setPreviousMonthRevenueError(null);
            try {
                const response = await axios.post('http://127.0.0.1:5000/actual_revenue', {
                    year: year,
                    month: month - 1,
                });

                if (response.data && response.data.actual_revenue !== null && response.data.actual_revenue !== undefined) {
                    const formatted = formatCurrency(response.data.actual_revenue);
                    setPreviousMonthRevenue(response.data.actual_revenue);
                    setFormattedPreviousMonthRevenue(formatted);
                    toast.success(`Đã tìm thấy doanh thu tháng trước (${formatted})`, { position: "top-right" });
                } else {
                    setPreviousMonthRevenue('');
                    setFormattedPreviousMonthRevenue('');
                    setPreviousMonthRevenueError(`Không có doanh thu tháng trước trong dữ liệu. Vui lòng nhập thủ công.`);
                }
            } catch (err) {
                setError(`Lỗi khi tìm doanh thu tháng trước: ${err.message}`);
                toast.error(`Lỗi khi tìm doanh thu tháng trước: ${err.message}`, { position: "top-right" });
            } finally {
                setLoading(false);
            }
        };

        fetchActualRevenue();
    }, [year, month]);

    useEffect(() => {
        setPredictedRevenue(null);
        setActualRevenue(null);
        setError(null);
        setActualRevenueError(null);
    }, [year, month]);

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!previousMonthRevenue && !formattedPreviousMonthRevenue) {
                setError("Vui lòng nhập doanh thu tháng trước.");
                toast.error("Vui lòng nhập doanh thu tháng trước.", { position: "top-right" });
                return;
            }

            let parsedPreviousMonthRevenue;
            if (typeof previousMonthRevenue === 'number') {
                parsedPreviousMonthRevenue = previousMonthRevenue;
            } else if (formattedPreviousMonthRevenue) {
                parsedPreviousMonthRevenue = parseFloat(deformatCurrency(formattedPreviousMonthRevenue));
            } else {
                setError("Vui lòng nhập doanh thu tháng trước.");
                toast.error("Vui lòng nhập doanh thu tháng trước.", { position: "top-right" });
                return;
            }


            const response = await axios.post('http://127.0.0.1:5000/predict', {
                year: year,
                month: month,
                previous_month_revenue: parsedPreviousMonthRevenue,
            });

            setPredictedRevenue(response.data.revenue);
            toast.success("Dự đoán doanh thu thành công!", { position: "top-right" });
        } catch (err) {
            setPredictedRevenue(null);
            setError(`Lỗi dự đoán doanh thu: ${err.message}`);
            toast.error(`Lỗi dự đoán doanh thu: ${err.message}`, { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const fetchActual = async () => {
        setLoading(true);
        setError(null);
        setActualRevenueError(null);
        try {
            const response = await axios.post('http://127.0.0.1:5000/actual_revenue', {
                year: year,
                month: month,
            });

            if (response.data && response.data.actual_revenue !== null && response.data.actual_revenue !== undefined) {
                setActualRevenue(response.data.actual_revenue);
            } else {
                setActualRevenue(null);
                setActualRevenueError(`Không có doanh thu thực tế để vẽ biểu đồ so sánh.`);
                toast.warn(`Không có doanh thu thực tế để vẽ biểu đồ so sánh.`, { position: "top-right" });
            }
        } catch (err) {
            setActualRevenue(null);
            setActualRevenueError(`Lỗi khi tìm doanh thu thực tế: ${err.message}`);
            toast.error(`Lỗi khi tìm doanh thu thực tế: ${err.message}`, { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) {
            return '';
        }
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const deformatCurrency = (formattedAmount) => {
        if (!formattedAmount) return '';
        const cleanedAmount = formattedAmount.replace(/[^0-9.-]+/g, '');
        return cleanedAmount;
    };

    const handleChangePreviousRevenue = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');

        if (rawValue.length <= 20) {
            const numberValue = rawValue === "" ? "" : Number(rawValue);
            const formattedValue = rawValue === "" ? "" : formatCurrency(numberValue);

            setPreviousMonthRevenue(numberValue);
            setFormattedPreviousMonthRevenue(formattedValue);
        }
    };

    useEffect(() => {
    }, []);

    const chartData = {
        labels: ['Doanh thu'],
        datasets: [
            {
                label: 'Thực tế',
                data: [actualRevenue !== null ? actualRevenue : 0],
                backgroundColor: '#28a745',
            },
            {
                label: 'Dự đoán',
                data: [predictedRevenue !== null ? predictedRevenue : 0],
                backgroundColor: '#007bff',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'So sánh doanh thu thực tế và dự đoán',
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: function (value, index, values) {
                        return formatCurrency(value);
                    }
                }
            }
        }
    };

    return (
        <div className="revenue-container">
            <h2 className="revenue-title">Dự Đoán Doanh Thu</h2>

            {error && <div className="revenue-error">{error}</div>}
            {actualRevenueError && <div className="revenue-error">{actualRevenueError}</div>}
            {previousMonthRevenueError && <div className="revenue-error">{previousMonthRevenueError}</div>}

            <div className="revenue-main-content">
                <div className="revenue-input-area">
                    <div className="revenue-form-group">
                        <label htmlFor="year">Năm:</label>
                        <input
                            type="number"
                            id="year"
                            className="revenue-input"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                        />
                    </div>

                    <div className="revenue-form-group">
                        <label htmlFor="month">Tháng:</label>
                        <select
                            id="month"
                            className="revenue-select"
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>

                    <div className="revenue-form-group">
                        <label htmlFor="previousMonthRevenue">Doanh thu tháng trước:</label>
                        <input
                            type="text"
                            id="previousMonthRevenue"
                            className="revenue-input"
                            value={formattedPreviousMonthRevenue}
                            onChange={handleChangePreviousRevenue}
                            placeholder="Nhập doanh thu tháng trước"
                            ref={inputRef}
                        />
                    </div>

                    <button className="revenue-button" onClick={() => { handlePredict(); fetchActual(); }} disabled={loading}>
                        {loading ? 'Đang tải...' : 'Dự đoán Doanh Thu'}
                    </button>
                </div>

                <div className="revenue-result-area">
                    {(predictedRevenue !== null || actualRevenue !== null) && (
                        <div className="revenue-results">
                            {predictedRevenue !== null && (
                                <div className="revenue-result">
                                    <h3>Doanh thu dự đoán:</h3>
                                    <p>{formatCurrency(predictedRevenue)}</p>
                                </div>
                            )}

                            {actualRevenue !== null && (
                                <div className="revenue-result">
                                    <h3>Doanh thu thực tế:</h3>
                                    <p>{formatCurrency(actualRevenue)}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {(actualRevenue !== null || predictedRevenue !== null) && !actualRevenueError && (
                        <div className="revenue-chart">
                            <Bar options={chartOptions} data={chartData} />
                        </div>
                    )}
                </div>
            </div>
            {/* Toast container to display notifications */}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default RevenuePrediction;