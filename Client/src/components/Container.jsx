import React, { useEffect, useState } from 'react';

const Container = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0); // New state for total sales
  const [recentActivities, setRecentActivities] = useState([]); // State for recent activities

  const getUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/users", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setTotalUsers(data.length); // Set total users
      } else {
        console.error("Failed to fetch users:", res.statusText);
      }
    } catch (error) {
      console.error("API link not working", error);
    }
  };

  const getOrders = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/request/purchase", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setTotalOrders(data.length); // Set total orders

        // Calculate total sales by summing up the totalCost of each purchase
        const total = data.reduce((sum, order) => {
          const cost = order.totalCost || 0; // Ensure totalCost is valid
          return sum + cost;
        }, 0);

        setTotalSales(total); // Set total sales

        // Update recent activities
        const activities = data.map(order => ({
          message: `User  ${order.username} made a purchase of $${order.totalCost}.`,
          date: new Date(order.date).toLocaleString(),
        }));
        setRecentActivities(activities.slice(-5)); // Display the last 5 activities
      } else {
        console.error("Failed to fetch orders:", res.statusText);
      }
    } catch (error) {
      console.error("API link not working", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getUsers(), getOrders()]); // Fetch users and orders concurrently
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetchData function
  }, []);

  return (
    <div className="w-auto bg-[#f4f4f4] p-8 sm:ml-0 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Card 1: Total Sales */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Sales today</h2>
          <p className="text-2xl font-bold">${totalSales}</p> {/* Display total sales */}
        </div>

        {/* Card 2: Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl font-bold">{totalUsers}</p> {/* Display total users */}
        </div>

        {/* Card 3: Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold">{totalOrders}</p> {/* Display total orders */}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul>
          {recentActivities.map((activity, index) => (
            <li key={index} className="border-b py-2">
              {activity.message} <span className="text-gray-500">({activity.date})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Container;