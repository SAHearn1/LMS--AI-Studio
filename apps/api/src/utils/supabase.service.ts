import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';
import { User, UserRole, AuthProvider } from '../types/auth.types';

class SupabaseService {
  private client: SupabaseClient;
  private adminClient: SupabaseClient;

  constructor() {
    // Client for user operations
    this.client = createClient(config.supabase.url, config.supabase.anonKey);
    
    // Admin client for privileged operations
    this.adminClient = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey
    );
  }

  async createUser(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    provider: AuthProvider = AuthProvider.LOCAL
  ): Promise<User> {
    // Create auth user in Supabase Auth
    const { data: authData, error: authError } = await this.adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (authError || !authData.user) {
      throw new Error(`Failed to create user: ${authError?.message}`);
    }

    // Create user profile in database
    const { data: userData, error: userError } = await this.adminClient
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role: UserRole.STUDENT,
        provider,
        provider_id: provider === AuthProvider.LOCAL ? null : authData.user.id,
        email_verified: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError) {
      // Rollback auth user if profile creation fails
      await this.adminClient.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Failed to create user profile: ${userError.message}`);
    }

    return this.mapToUser(userData);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.adminClient
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToUser(data);
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.adminClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToUser(data);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
    if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.emailVerified !== undefined) updateData.email_verified = updates.emailVerified;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.lastLogin !== undefined) updateData.last_login = updates.lastLogin;

    const { data, error } = await this.adminClient
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update user: ${error?.message}`);
    }

    return this.mapToUser(data);
  }

  async verifyEmail(userId: string): Promise<void> {
    const { error } = await this.adminClient.auth.admin.updateUserById(userId, {
      email_confirm: true,
    });

    if (error) {
      throw new Error(`Failed to verify email: ${error.message}`);
    }

    await this.updateUser(userId, { emailVerified: true });
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const { error } = await this.adminClient.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      throw new Error(`Failed to update password: ${error.message}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete from auth
    const { error: authError } = await this.adminClient.auth.admin.deleteUser(userId);
    
    if (authError) {
      throw new Error(`Failed to delete user from auth: ${authError.message}`);
    }

    // Delete from database (should cascade if configured)
    const { error: dbError } = await this.adminClient
      .from('users')
      .delete()
      .eq('id', userId);

    if (dbError) {
      throw new Error(`Failed to delete user profile: ${dbError.message}`);
    }
  }

  async findOrCreateOAuthUser(
    email: string,
    provider: AuthProvider,
    providerId: string,
    firstName?: string,
    lastName?: string
  ): Promise<User> {
    // Check if user exists
    let user = await this.getUserByEmail(email);

    if (!user) {
      // Create new user without password
      const { data: authData, error: authError } = await this.adminClient.auth.admin.createUser({
        email,
        email_confirm: true,
      });

      if (authError || !authData.user) {
        throw new Error(`Failed to create OAuth user: ${authError?.message}`);
      }

      const { data: userData, error: userError } = await this.adminClient
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role: UserRole.STUDENT,
          provider,
          provider_id: providerId,
          email_verified: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) {
        await this.adminClient.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Failed to create OAuth user profile: ${userError.message}`);
      }

      user = this.mapToUser(userData);
    }

    return user;
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role as UserRole,
      provider: data.provider as AuthProvider,
      providerId: data.provider_id,
      emailVerified: data.email_verified,
      isActive: data.is_active,
      lastLogin: data.last_login ? new Date(data.last_login) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  getAdminClient(): SupabaseClient {
    return this.adminClient;
  }
}

export const supabaseService = new SupabaseService();
