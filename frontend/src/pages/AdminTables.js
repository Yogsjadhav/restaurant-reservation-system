import { useState, useEffect } from 'react';
import { tableService } from '../services/api';

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: ''
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await tableService.getTables();
      setTables(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tables');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await tableService.createTable({
        tableNumber: parseInt(formData.tableNumber),
        capacity: parseInt(formData.capacity)
      });
      
      setFormData({ tableNumber: '', capacity: '' });
      setShowForm(false);
      fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create table');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await tableService.updateTable(id, { isActive: !currentStatus });
      fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update table');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this table?')) {
      return;
    }

    try {
      await tableService.deleteTable(id);
      fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete table');
    }
  };

  if (loading) {
    return <div className="admin-tables-loading">Loading...</div>;
  }

  return (
    <div className="admin-tables-container">
      <div className="admin-tables-header">
        <h2 className="admin-tables-title">Manage Tables</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="admin-tables-add-button"
        >
          {showForm ? 'Cancel' : '+ Add Table'}
        </button>
      </div>
      
      {error && <div className="admin-tables-error">{error}</div>}
      
      {showForm && (
        <div className="admin-tables-form-wrapper">
          <h3 className="admin-tables-form-title">Add New Table</h3>
          <form onSubmit={handleSubmit} className="admin-tables-form">
            <div className="admin-tables-form-group">
              <label className="admin-tables-label">Table Number</label>
              <input
                type="number"
                value={formData.tableNumber}
                onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                required
                min="1"
                className="admin-tables-input"
                placeholder="Enter table number"
              />
            </div>
            
            <div className="admin-tables-form-group">
              <label className="admin-tables-label">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
                min="1"
                className="admin-tables-input"
                placeholder="Enter capacity"
              />
            </div>
            
            <button type="submit" className="admin-tables-submit-button">
              Create Table
            </button>
          </form>
        </div>
      )}
      
      <div className="admin-tables-table-wrapper">
        <table className="admin-tables-table">
          <thead>
            <tr>
              <th className="admin-tables-th">Table Number</th>
              <th className="admin-tables-th">Capacity</th>
              <th className="admin-tables-th">Status</th>
              <th className="admin-tables-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table._id} className="admin-tables-tr">
                <td className="admin-tables-td">Table {table.tableNumber}</td>
                <td className="admin-tables-td">{table.capacity} guests</td>
                <td className="admin-tables-td">
                  <span className={`admin-tables-badge ${table.isActive ? 'admin-tables-badge-active' : 'admin-tables-badge-inactive'}`}>
                    {table.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="admin-tables-td">
                  <button
                    onClick={() => handleToggleActive(table._id, table.isActive)}
                    className={`admin-tables-action-button ${table.isActive ? 'admin-tables-action-button-deactivate' : 'admin-tables-action-button-activate'}`}
                  >
                    {table.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(table._id)}
                    className="admin-tables-action-button admin-tables-action-button-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTables;
