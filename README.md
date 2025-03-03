# Multi Server Simulator

## Overview

This project is a simulator for M/M/C and M/G/C queuing systems. Users can input parameters such as arrival rate (λ), service rate (µ), model type (M/M/C or M/G/C), and the number of servers. Upon submitting the inputs, the simulator generates a comprehensive table with various queuing system metrics, followed by a Queuing Calculator Table and a Gantt chart for visualization.

[Live Demo](https://simulation-project-siddiqahmed882.netlify.app)

To run locally, follow the instructions below.

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (Recommended: Latest LTS version)

## Getting Started

### 1. Clone or Download the Project

#### Clone via Git:
```sh
git clone <repository-url>
cd <project-folder>
```

#### Or Download ZIP:
- Click the **Code** button on the repository page.
- Select **Download ZIP**.
- Extract the ZIP file and open the folder in a terminal.

### 2. Install Dependencies

```sh
npm install
```

### 3. Run the Project

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## Usage

### 1. Input Parameters

Provide the following inputs:

- Arrival Rate (λ): Rate at which customers arrive.
- Service Rate (µ): Rate at which customers are served.
- Model Type: Choose between M/M/C or M/G/C.
- Number of Servers: Specify the number of servers.
  Click the submit button to generate the main table.

### 2. Generated Table

The table includes the following columns:

- S.no#: Serial number.
- Cp Lookup: Lookup value for cumulative probability.
- Cumulative Probability (Cp): Cumulative probability of arrival.
- Avg Time Between Arrivals: Average time between arrivals.
- Inter Arrival Time: Time between consecutive arrivals.
- Arrival Time: Time at which a customer arrives.
- Service Time: Time taken to serve a customer.
- Start Time: Time at which service starts.
- End Time: Time at which service ends.
- Turnaround Time: Total time a customer spends in the system.
- Waiting Time: Time a customer waits in the queue.
- Response Time: Time taken to respond to a customer.
  The number of rows and total customers are determined when cumulative probability reaches 1.

![image](/public/readme/img1.png)

### 3. Queuing Calculator Table

Displays various metrics for the queuing system:

- Utilization Factor (ρ)
- Average Time a Customer Spends in the System (W)
- Average Time a Customer Spends Waiting in the Queue (Wq)
- Average Number of Customers in the Queue (Lq)
- Average Number of Customers in the System (L)
- Proportion of Time the Server is Idle (Idle)
- Average Turnaround Time
- Average Response Time
- Average Waiting Time

![image](/public/readme/img2.png)

### 4. Gantt Chart

Generates a Gantt chart for queuing system visualization.
![image](/public/readme/img3.png)
