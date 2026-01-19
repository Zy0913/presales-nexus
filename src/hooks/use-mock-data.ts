"use client";

import { useState, useEffect, useCallback } from 'react';
import { User, ProjectMember, UserRole } from '@/types';
import { mockUsers as initialUsers, mockProjectMembers as initialProjectMembers } from '@/lib/mock-data';

// Singleton state to persist across navigation
let globalUsers = [...initialUsers];
let globalProjectMembers = [...initialProjectMembers];
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useMockData() {
  const [users, setUsers] = useState<User[]>(globalUsers);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>(globalProjectMembers);

  useEffect(() => {
    const handleChange = () => {
      setUsers([...globalUsers]);
      setProjectMembers([...globalProjectMembers]);
    };

    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  // User Operations
  const addUser = useCallback((user: Omit<User, 'id' | 'createdAt' | 'lastActiveAt'>) => {
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    globalUsers = [...globalUsers, newUser];
    notifyListeners();
    return newUser;
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    globalUsers = globalUsers.map(u => u.id === id ? { ...u, ...updates } : u);
    notifyListeners();
  }, []);

  const deleteUser = useCallback((id: string) => {
    globalUsers = globalUsers.filter(u => u.id !== id);
    // Also remove from project members
    globalProjectMembers = globalProjectMembers.filter(pm => pm.userId !== id);
    notifyListeners();
  }, []);

  // Project Member Operations
  const addProjectMember = useCallback((projectId: string, userId: string, role: ProjectMember['role']) => {
    const user = globalUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const newMember: ProjectMember = {
      id: `pm_${Date.now()}`,
      projectId,
      userId,
      user,
      role,
      joinedAt: new Date().toISOString(),
    };

    // Check if already exists
    if (globalProjectMembers.some(pm => pm.projectId === projectId && pm.userId === userId)) {
      return;
    }

    globalProjectMembers = [...globalProjectMembers, newMember];
    notifyListeners();
  }, []);

  const updateProjectMemberRole = useCallback((memberId: string, newRole: ProjectMember['role']) => {
    globalProjectMembers = globalProjectMembers.map(pm =>
      pm.id === memberId ? { ...pm, role: newRole } : pm
    );
    notifyListeners();
  }, []);

  const removeProjectMember = useCallback((memberId: string) => {
    globalProjectMembers = globalProjectMembers.filter(pm => pm.id !== memberId);
    notifyListeners();
  }, []);

  const getProjectMembers = useCallback((projectId: string) => {
    return globalProjectMembers.filter(pm => pm.projectId === projectId);
  }, []);

  return {
    users,
    projectMembers,
    addUser,
    updateUser,
    deleteUser,
    addProjectMember,
    updateProjectMemberRole,
    removeProjectMember,
    getProjectMembers
  };
}
