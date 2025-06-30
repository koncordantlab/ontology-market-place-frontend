// Demo Authentication Service for Development and Testing
export interface DemoUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'researcher' | 'student';
  department?: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-admin-1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    photoURL: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    department: 'Computer Science'
  },
  {
    id: 'demo-researcher-1',
    name: 'Prof. Michael Rodriguez',
    email: 'michael.rodriguez@research.org',
    photoURL: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    role: 'researcher',
    department: 'Biomedical Engineering'
  },
  {
    id: 'demo-researcher-2',
    name: 'Dr. Emily Watson',
    email: 'emily.watson@medcenter.edu',
    photoURL: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    role: 'researcher',
    department: 'Medical Informatics'
  },
  {
    id: 'demo-student-1',
    name: 'Alex Thompson',
    email: 'alex.thompson@student.edu',
    photoURL: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    role: 'student',
    department: 'Data Science'
  },
  {
    id: 'demo-student-2',
    name: 'Jordan Kim',
    email: 'jordan.kim@student.edu',
    photoURL: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    role: 'student',
    department: 'Information Systems'
  }
];

class DemoAuthService {
  private currentUser: DemoUser | null = null;
  private listeners: ((user: DemoUser | null) => void)[] = [];

  constructor() {
    // Check for stored demo user
    const storedUser = localStorage.getItem('demo-user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored demo user:', error);
        localStorage.removeItem('demo-user');
      }
    }
  }

  // Sign in with demo user
  signInWithDemo(userId: string): Promise<DemoUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = DEMO_USERS.find(u => u.id === userId);
        if (user) {
          this.currentUser = user;
          localStorage.setItem('demo-user', JSON.stringify(user));
          this.notifyListeners();
          resolve(user);
        } else {
          reject(new Error('Demo user not found'));
        }
      }, 500); // Simulate network delay
    });
  }

  // Sign out
  signOut(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        localStorage.removeItem('demo-user');
        this.notifyListeners();
        resolve();
      }, 300);
    });
  }

  // Get current user
  getCurrentUser(): DemoUser | null {
    return this.currentUser;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Add auth state listener
  onAuthStateChange(callback: (user: DemoUser | null) => void): () => void {
    this.listeners.push(callback);
    
    // Call immediately with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  // Get user by role
  getUsersByRole(role: 'admin' | 'researcher' | 'student'): DemoUser[] {
    return DEMO_USERS.filter(user => user.role === role);
  }

  // Get all demo users
  getAllDemoUsers(): DemoUser[] {
    return DEMO_USERS;
  }
}

export const demoAuthService = new DemoAuthService();