
import { createSupabaseServerClient } from '@/lib/supabase/client';
import bcrypt from 'bcryptjs';

export async function seedSuperAdmin() {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const supabase = createSupabaseServerClient();

  if (!superAdminEmail) {
    console.log('SUPER_ADMIN_EMAIL environment variable not set. Skipping super admin seed.');
    return;
  }

  // 1. Find any existing super admin
  const { data: existingSuperAdmins, error: findError } = await supabase
    .from('users')
    .select('id, email')
    .eq('role', 'superadmin');

  if (findError) {
    console.error("Error finding existing super admins:", findError.message);
    return;
  }

  // 2. If existing super admins have emails that don't match the one in .env, delete them.
  if (existingSuperAdmins && existingSuperAdmins.length > 0) {
    const adminsToDelete = existingSuperAdmins.filter(admin => admin.email !== superAdminEmail);
    if (adminsToDelete.length > 0) {
      const idsToDelete = adminsToDelete.map(admin => admin.id);
      console.log(`Found old super admins to delete with IDs: ${idsToDelete.join(', ')}.`);
      const { error: deleteError } = await supabase.from('users').delete().in('id', idsToDelete);
      if (deleteError) {
        console.error("Error deleting old super admins:", deleteError.message);
      } else {
        console.log('Old super admins deleted.');
      }
    }
  }

  // 3. Find the correct super admin by email from .env
  const { data: correctSuperAdmin, error: fetchCorrectError } = await supabase
    .from('users')
    .select('id, role')
    .eq('email', superAdminEmail)
    .single();

  if (fetchCorrectError && fetchCorrectError.code !== 'PGRST116') { // PGRST116 means "No rows found"
      console.error("Error fetching correct super admin:", fetchCorrectError.message);
      return;
  }

  // 4. If the correct super admin doesn't exist, create them.
  if (!correctSuperAdmin) {
    console.log(`Super admin with email ${superAdminEmail} not found. Creating...`);
    const hashedPassword = await bcrypt.hash('password', 10);
    
    const { error: createError } = await supabase.from('users').insert({
        email: superAdminEmail,
        name: 'Super Admin',
        password: hashedPassword,
        phone: '0000000000', // Placeholder phone
        role: 'superadmin',
      });
    
    if (createError) {
        console.error("Error creating super admin:", createError.message);
    } else {
        console.log('Super admin created successfully with default password "password".');
    }
  } else {
     // Optional: Ensure the role is correct if the user exists but not as a superadmin
    if (correctSuperAdmin.role !== 'superadmin') {
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'superadmin' })
        .eq('id', correctSuperAdmin.id);

      if (updateError) {
        console.error(`Failed to update user role for ${superAdminEmail}:`, updateError.message);
      } else {
         console.log(`Updated user ${superAdminEmail} to superadmin role.`);
      }
    } else {
      console.log('Super admin already exists and is configured correctly.');
    }
  }
}
