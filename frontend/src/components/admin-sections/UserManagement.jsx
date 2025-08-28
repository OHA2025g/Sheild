import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Plus, Edit2, Trash2, Key, Users as UsersIcon } from 'lucide-react';

const UserManagement = ({
  users,
  showUserForm,
  setShowUserForm,
  editingUser,
  setEditingUser,
  userForm,
  setUserForm,
  showPasswordForm,
  setShowPasswordForm,
  passwordForm,
  setPasswordForm,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  handleUpdatePassword,
  currentUser
}) => {
  const resetUserForm = () => {
    setUserForm({
      username: '',
      name: '',
      email: '',
      password: '',
      role: 'admin'
    });
    setEditingUser(null);
    setShowUserForm(false);
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setShowPasswordForm(false);
  };

  const handleEdit = (user) => {
    setUserForm({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setEditingUser(user);
    setShowUserForm(true);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'editor':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage admin users and their permissions</p>
        </div>
        {currentUser?.role === 'super_admin' && (
          <Button
            onClick={() => {
              resetUserForm();
              setShowUserForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      {/* Users List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <Badge className={`mt-2 ${getRoleBadgeColor(user.role)}`}>
                    {user.role?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Created: {new Date(user.created_at).toLocaleDateString()}</p>
                    {user.last_login && (
                      <p>Last login: {new Date(user.last_login).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  {(currentUser?.role === 'super_admin' || currentUser?.id === user.id) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                  {currentUser?.id === user.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      <Key className="h-3 w-3" />
                    </Button>
                  )}
                  {currentUser?.role === 'super_admin' && 
                   currentUser?.id !== user.id && 
                   user.role !== 'super_admin' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingUser ? 'Edit User' : 'Create New User'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={userForm.username}
                  onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                  disabled={editingUser}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

            {!editingUser && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password (min 6 characters)"
                />
              </div>
            )}

            {currentUser?.role === 'super_admin' && (
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={userForm.role}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetUserForm}>
                Cancel
              </Button>
              <Button
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Password Change Form */}
      {showPasswordForm && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
            
            <div>
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetPasswordForm}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePassword}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={passwordForm.new_password !== passwordForm.confirm_password}
              >
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            User Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-blue-600">Total Users</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => u.role === 'super_admin').length}
              </div>
              <div className="text-sm text-red-600">Super Admins</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-sm text-green-600">Admins</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter(u => u.is_active).length}
              </div>
              <div className="text-sm text-yellow-600">Active Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;