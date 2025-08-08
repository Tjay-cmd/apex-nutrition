// Utility script to update user roles in Supabase
// Run this with: node scripts/update-user-role.js

const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://ahxsnfciwhvfhlyqnsxc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoeHNuZmNpd2h2ZmhseXFuc3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDc3MzUsImV4cCI6MjA2OTUyMzczNX0.PiDWp3k7efGbk2si9c-vI1iqSWW29rhFZG_4gNxHtiY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUserRole(userEmail, newRole) {
  try {
    console.log(`Updating role for user: ${userEmail} to: ${newRole}`);

    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('email', userEmail);

    if (error) {
      console.error('Error updating user role:', error);
      return;
    }

    console.log('User role updated successfully!');
    console.log('Updated data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function listUsers() {
  try {
    console.log('Listing all users...');

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, role, created_at');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    console.log('Users:');
    data.forEach(user => {
      console.log(`- ${user.email} (${user.first_name} ${user.last_name}) - Role: ${user.role}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example usage:
// To list all users:
// listUsers();

// To update a user's role:
// updateUserRole('your-email@example.com', 'super_admin');

// Uncomment the line below and replace with the email you want to make CEO
// updateUserRole('your-email@example.com', 'super_admin');

console.log('Script loaded. Uncomment the lines below to use:');
console.log('1. listUsers() - to see all users');
console.log('2. updateUserRole("email@example.com", "super_admin") - to make someone CEO');
console.log('3. updateUserRole("email@example.com", "admin") - to make someone admin');
console.log('4. updateUserRole("email@example.com", "customer") - to make someone customer');