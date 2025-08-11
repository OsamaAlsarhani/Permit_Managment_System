import React from 'react'

import  { useEffect, useState, useContext } from 'react';
import PermitTable from './PermitTable';
import PermitDetails from './PermitDetails';
import UpdatePermitFormForUser from './UpdatePermitFormForUser';
import { getPermitForAllUsers, updateStatus,deletePermitAsAdmin } from '../Services/authService'; // you need updatePermit implemented
import { AuthContext } from '../Context/AuthContext';

const AdminPermitsContainer = () => {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [editingPermit, setEditingPermit] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!auth?.isAuthenticated) return;

    const fetchPermits = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPermitForAllUsers();
        setPermits(data);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPermits();
  }, [auth?.isAuthenticated]);

  const handleDetails = (permit) => setSelectedPermit(permit);

  const handleUpdate = (permit) => {
    // if (permit.status !== 'EDIT_REQUESTED') {
    //   alert('This permit is not in editable state. Only permits with status EDIT_REQUESTED can be edited.');
    //   return;
    // }
    setEditingPermit(permit);
  };

  const handleUpdateSubmit = async (id, updatedForm) => {
    try {
      await updateStatus(id, updatedForm); // your backend should accept DTO with path id
      alert('Permit updated');
      setEditingPermit(null);
      // refresh list
      const refreshed = await getPermitForAllUsers();
      setPermits(refreshed);
    } catch (e) {
      console.error('Update failed', e);
      throw e; // let form display error
    }
  };
  const handleDelete = async (permit) => {
    if (window.confirm(`Are you sure you want to delete permit ${permit.id}?`)) {
      try {
          const response = await deletePermitAsAdmin(permit.id);
          if (response.status === 200) {
             // refresh list
            const refreshed = await getPermitForAllUsers();
            setPermits(refreshed);
   
          }
        } catch (e) {
          console.error('Delete failed', e);
          alert('Failed to delete permit');
        }
      }
  };
  return (
    <div>
      {loading && <div>Loading permits...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      <PermitTable
        permits={permits}
        onDetails={handleDetails}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        emptyMessage="You have no permits yet."
      />

      {selectedPermit && (
        <PermitDetails permit={selectedPermit} onClose={() => setSelectedPermit(null)} />
      )}

      {editingPermit && (
        <UpdatePermitFormForUser
          permit={editingPermit}
          onSubmit={handleUpdateSubmit}
          onCancel={() => setEditingPermit(null)}
        />
      )}
    </div>
  );
};

export default AdminPermitsContainer;



