import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, Grid, Trash2, Edit, LineChart as ChartIcon, Home } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import Swal from 'sweetalert2';

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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EBBE43',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://127.0.0.1:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setUsers(users.filter(user => user.id !== userId));
          fetchDashboardData();
          Swal.fire(
            'Deleted!',
            'User has been deleted successfully.',
            'success'
          );
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire(
          'Error!',
          'Failed to delete user.',
          'error'
        );
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EBBE43',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://127.0.0.1:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setProducts(products.filter(product => product.id !== productId));
          fetchDashboardData();
          Swal.fire(
            'Deleted!',
            'Product has been deleted successfully.',
            'success'
          );
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire(
          'Error!',
          'Failed to delete product.',
          'error'
        );
      }
    }
  };

  const NavItem = ({ icon: Icon, text, view }) => (
    <div
      onClick={() => setActiveView(view)}
      className={`flex items-center p-4 cursor-pointer transition-all duration-200 hover:bg-[#EBBE43] hover:text-white
        ${activeView === view ? 'bg-[#EBBE43] text-white' : 'text-gray-600'}`}
    >
      <Icon className="h-5 w-5" />
      <span className={`ml-4 transition-all duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
        {text}
      </span>
    </div>
  );

  const Sidebar = () => (
    <div
      className="fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50"
      style={{ width: sidebarExpanded ? '240px' : '72px' }}
      onMouseEnter={() => setSidebarExpanded(true)}
      onMouseLeave={() => setSidebarExpanded(false)}
    >
      <div className="p-4 border-b">
        <h2 className={`font-bold text-[#EBBE43] transition-all duration-200 
          ${sidebarExpanded ? 'text-xl' : 'text-sm text-center'}`}>
          {sidebarExpanded ? 'Admin Dashboard' : 'AD'}
        </h2>
      </div>
      <nav className="mt-6">
        <NavItem icon={Home} text="Dashboard" view="dashboard" />
        <NavItem icon={Users} text="Users" view="users" />
        <NavItem icon={Package} text="Products" view="products" />
      </nav>
    </div>
  );

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} title="Total Users" value={stats.totalUsers} />
        <StatCard icon={Package} title="Total Products" value={stats.totalProducts} />
        <StatCard icon={ShoppingCart} title="Total Orders" value={stats.totalOrders} />
        <StatCard icon={Grid} title="Categories" value={stats.totalCategories} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6 text-[#EBBE43]">Growth Trends</h2>
          <div className="h-80">
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

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6 text-[#EBBE43]">Distribution Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Users', value: stats.totalUsers, color: '#EBBE43' },
                    { name: 'Products', value: stats.totalProducts, color: '#82ca9d' },
                    { name: 'Orders', value: stats.totalOrders, color: '#8884d8' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {[
                    { color: '#EBBE43' },
                    { color: '#82ca9d' },
                    { color: '#8884d8' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-[#EBBE43]" />
      </div>
    </div>
  );

  const UsersView = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-[#EBBE43]">Users Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
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
  );

  const ProductsView = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-[#EBBE43]">Products Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
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
      <Sidebar />
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: sidebarExpanded ? '240px' : '72px' }}
      >
        <div className="p-6 space-y-6">
          {activeView === 'dashboard' && (
            <>
              <h1 className="text-2xl font-bold text-[#EBBE43] mb-6">Dashboard Overview</h1>
              <DashboardOverview />
            </>
          )}
          {activeView === 'users' && <UsersView />}
          {activeView === 'products' && <ProductsView />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;