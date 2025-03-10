'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function QueueCalculator() {
  const [numServers, setNumServers] = useState(1);
  const [numCustomers, setNumCustomers] = useState(5);
  const [arrivalRate, setArrivalRate] = useState(2);
  const [serviceRate, setServiceRate] = useState(3);
  const [customerData, setCustomerData] = useState([]);

  const generateData = () => {
    const data = [];
    let arrivalTime = 0;
    const serverAvailability = Array(numServers).fill(0);

    for (let i = 0; i < numCustomers; i++) {
      const interArrivalTime = i === 0 ? 0 : Math.floor(Math.random() * 10);
      const serviceTime = Math.floor(Math.random() * 10) + 1;
      arrivalTime += interArrivalTime;

      // Find the first available server
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

      // Update server availability
      const serverIndex = serverAvailability.indexOf(earliestServer);
      serverAvailability[serverIndex] = endTime;
    }
    setCustomerData(data);
  };

  // Compute system metrics
  const totalWaitingTime = customerData.reduce((sum, c) => sum + c.waitingTime, 0);
  const totalTurnaroundTime = customerData.reduce((sum, c) => sum + c.turnaroundTime, 0);
  const avgWaitingTime = (totalWaitingTime / numCustomers).toFixed(2);
  const avgTurnaroundTime = (totalTurnaroundTime / numCustomers).toFixed(2);
  const utilizationFactor = ((arrivalRate / (numServers * serviceRate)) * 100).toFixed(2);
  const idleTime = (100 - parseFloat(utilizationFactor)).toFixed(2);

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-bold mb-4 text-center'>
        Queuing System Calculator (M/M/C)
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
            <h2 className='text-xl font-bold mb-2'>M/M/{numServers}</h2>
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
                  <td className='border p-2'>Utilization Factor (ρ)</td>
                  <td className='border p-2'>{utilizationFactor}%</td>
                </tr>
                <tr>
                  <td className='border p-2'>Average Waiting Time (AWT)</td>
                  <td className='border p-2'>{avgWaitingTime}</td>
                </tr>
                <tr>
                  <td className='border p-2'>Average Turnaround Time (ATT)</td>
                  <td className='border p-2'>{avgTurnaroundTime}</td>
                </tr>
                <tr>
                  <td className='border p-2'>Proportion of Time the Server is Idle</td>
                  <td className='border p-2'>{idleTime}%</td>
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

export const GanttChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.endTime) || 0])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([0, height])
      .padding(0.1);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g').call(d3.axisLeft(y).tickFormat((d) => `Customer ${d}`));

    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.startTime))
      .attr('y', (_, i) => y(i.toString()) || 0)
      .attr('width', (d) => x(d.endTime) - x(d.startTime))
      .attr('height', y.bandwidth())
      .attr('fill', 'steelblue');
  }, [data]);

  return <svg ref={ref} width={1000} height={400}></svg>;
};
