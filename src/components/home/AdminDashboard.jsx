import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, Grid, Trash2, Edit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [statsHistory, setStatsHistory] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get Users
      const usersResponse = await axios.get('http://127.0.0.1:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Get Stats
      const statsResponse = await axios.get('http://127.0.0.1:5000/api/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Get Products if in products view
      if (activeView === 'products') {
        const productsResponse = await axios.get('http://127.0.0.1:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(productsResponse.data.products);
      }

      // Mock stats history - replace with actual API data when available
      const mockStatsHistory = [
        { month: 'Jan', users: 120, products: 50, orders: 80 },
        { month: 'Feb', users: 150, products: 65, orders: 95 },
        { month: 'Mar', users: 180, products: 75, orders: 120 },
        { month: 'Apr', users: 220, products: 90, orders: 150 },
        { month: 'May', users: 250, products: 100, orders: 180 },
      ];
      
      setStatsHistory(mockStatsHistory);
      setStats(statsResponse.data.stats);
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeView]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://127.0.0.1:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setUsers(users.filter(user => user.id !== userId));
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://127.0.0.1:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setProducts(products.filter(product => product.id !== productId));
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const StatisticsChart = () => {
    const pieData = [
      { name: 'Users', value: stats.totalUsers, color: '#EBBE43' },
      { name: 'Products', value: stats.totalProducts, color: '#82ca9d' },
      { name: 'Orders', value: stats.totalOrders, color: '#8884d8' },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow mb-8">
        {/* Pie Chart */}
        <div className="h-80">
          <h2 className="text-xl font-semibold mb-4 text-[#EBBE43]">Distribution Statistics</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="h-80">
          <h2 className="text-xl font-semibold mb-4 text-[#EBBE43]">Growth Statistics</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#EBBE43" name="Users" />
              <Line type="monotone" dataKey="products" stroke="#82ca9d" name="Products" />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div 
        className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-50"
        onClick={() => setActiveView('dashboard')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <Users className="h-8 w-8 text-[#EBBE43]" />
        </div>
      </div>
      
      <div 
        className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-50"
        onClick={() => setActiveView('products')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
          <Package className="h-8 w-8 text-[#EBBE43]" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <ShoppingCart className="h-8 w-8 text-[#EBBE43]" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Categories</p>
            <p className="text-2xl font-bold">{stats.totalCategories}</p>
          </div>
          <Grid className="h-8 w-8 text-[#EBBE43]" />
        </div>
      </div>
    </div>
  );

  const ProductsTable = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#EBBE43]">Products Management</h2>
          <button 
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 bg-[#EBBE43] text-white rounded hover:bg-[#d4a93c]"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${product.basePrice}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.owner?.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => alert('Edit functionality to be implemented')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EBBE43]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#EBBE43]">Admin Dashboard</h1>
        
        <StatsCards />
        
        {activeView === 'dashboard' && (
          <>
            <StatisticsChart />
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#EBBE43]">Users Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#EBBE43] text-white">
                              {user.roles}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user._count?.orders || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {!user.isAdmin && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'products' && <ProductsTable />}
      </div>
    </div>
  );
};

export default AdminDashboard;