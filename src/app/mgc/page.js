'use client';

import React, { useState } from 'react';
import { GanttChart } from '../page';

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

export default function QueueCalculator() {
  const [numServers, setNumServers] = useState(1);
  const [numCustomers, setNumCustomers] = useState(5);
  const [arrivalRate, setArrivalRate] = useState(2);
  const [serviceRate, setServiceRate] = useState(3);
  const [customerData, setCustomerData] = useState([]);
  const [metrics, setMetrics] = useState({
    L: 0,
    Lq: 0,
    W: 0,
    Wq: 0,
    rho: 0,
  });

  const calculateMetrics = () => {
    const rho = arrivalRate / (numServers * serviceRate);
    const P0 =
      1 /
      (Array.from(
        { length: numServers },
        (_, n) => Math.pow(arrivalRate / serviceRate, n) / factorial(n)
      ).reduce((a, b) => a + b, 0) +
        Math.pow(arrivalRate / serviceRate, numServers) /
          (factorial(numServers) * (1 - rho)));
    const Lq =
      (P0 * Math.pow(arrivalRate / serviceRate, numServers) * rho) /
      (factorial(numServers) * Math.pow(1 - rho, 2));
    const L = Lq + arrivalRate / serviceRate;
    const Wq = Lq / arrivalRate;
    const W = Wq + 1 / serviceRate;

    setMetrics({ L, Lq, W, Wq, rho });
  };

  const generateData = () => {
    const data = [];
    let arrivalTime = 0;
    const serverAvailability = Array(numServers).fill(0);

    for (let i = 0; i < numCustomers; i++) {
      const interArrivalTime = i === 0 ? 0 : Math.floor(Math.random() * 10);
      const serviceTime = Math.floor(Math.random() * 10) + 1;
      arrivalTime += interArrivalTime;

      const earliestServer = Math.min(...serverAvailability);
      const startTime = Math.max(arrivalTime, earliestServer);
      const endTime = startTime + serviceTime;
      const turnaroundTime = endTime - arrivalTime;
      const waitingTime = startTime - arrivalTime;
      const responseTime = waitingTime + serviceTime;

      data.push({
        interArrivalTime,
        arrivalTime,
        serviceTime,
        startTime,
        endTime,
        turnaroundTime,
        waitingTime,
        responseTime,
      });

      const serverIndex = serverAvailability.indexOf(earliestServer);
      serverAvailability[serverIndex] = endTime;
    }
    setCustomerData(data);
    calculateMetrics();
  };

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-bold mb-4 text-center'>
        Queuing System Calculator (M/G/C)
      </h1>
      <div className='flex flex-col space-y-4 mb-4'>
        <label>
          Number of Servers:
          <input
            type='number'
            value={numServers}
            onChange={(e) => setNumServers(Number(e.target.value))}
            className='border p-2 w-full'
          />
        </label>
        <label>
          Number of Customers:
          <input
            type='number'
            value={numCustomers}
            onChange={(e) => setNumCustomers(Number(e.target.value))}
            className='border p-2 w-full'
          />
        </label>
        <label>
          Arrival Rate (λ):
          <input
            type='number'
            value={arrivalRate}
            onChange={(e) => setArrivalRate(Number(e.target.value))}
            className='border p-2 w-full'
          />
        </label>
        <label>
          Service Rate (μ):
          <input
            type='number'
            value={serviceRate}
            onChange={(e) => setServiceRate(Number(e.target.value))}
            className='border p-2 w-full'
          />
        </label>
        <button
          onClick={generateData}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Calculate
        </button>
      </div>

      {customerData.length > 0 && (
        <>
          <div className='mb-4'>
            <h2 className='text-xl font-bold mb-2'>M/G/{numServers}</h2>
            <table className='w-full border-collapse border border-gray-300 mt-4'>
              <thead>
                <tr className='bg-gray-800 text-white'>
                  <th className='border p-2'>Inter Arrival Time</th>
                  <th className='border p-2'>Arrival Time</th>
                  <th className='border p-2'>Service Time</th>
                  <th className='border p-2'>Start Time</th>
                  <th className='border p-2'>End Time</th>
                  <th className='border p-2'>Turnaround Time</th>
                  <th className='border p-2'>Waiting Time</th>
                  <th className='border p-2'>Response Time</th>
                </tr>
              </thead>
              <tbody>
                {customerData.map((row, index) => (
                  <tr key={index} className='border'>
                    <td className='border p-2 text-center'>{row.interArrivalTime}</td>
                    <td className='border p-2 text-center'>{row.arrivalTime}</td>
                    <td className='border p-2 text-center'>{row.serviceTime}</td>
                    <td className='border p-2 text-center'>{row.startTime}</td>
                    <td className='border p-2 text-center'>{row.endTime}</td>
                    <td className='border p-2 text-center'>{row.turnaroundTime}</td>
                    <td className='border p-2 text-center'>{row.waitingTime}</td>
                    <td className='border p-2 text-center'>{row.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mb-4'>
            <h2 className='text-xl font-bold mb-2'>Performance Metrics</h2>
            <table className='w-full border-collapse border border-gray-300 mt-4'>
              <thead>
                <tr className='bg-black text-white'>
                  <th className='border p-2'>Metric</th>
                  <th className='border p-2'>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>L (Avg in System)</td>
                  <td>{metrics.L.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Lq (Avg in Queue)</td>
                  <td>{metrics.Lq.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>W (Avg Time in System)</td>
                  <td>{metrics.W.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Wq (Avg Time in Queue)</td>
                  <td>{metrics.Wq.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>ρ (Utilization)</td>
                  <td>{metrics.rho.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <GanttChart data={customerData} />
          </div>
        </>
      )}
    </div>
  );
}
