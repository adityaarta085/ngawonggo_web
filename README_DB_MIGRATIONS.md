# Database RPC for User Management

To support the delete functionality requested, we need a PostgreSQL RPC function that has elevated permissions to delete users.
Since `get_all_users` exists and likely uses `SECURITY DEFINER`, we should ensure `delete_user_by_id` is created in Supabase SQL Editor:

```sql
create or replace function delete_user_by_id(user_id uuid)
returns void as $$
begin
  -- Only allow admins (you should add logic to check if current user is admin)
  delete from auth.users where id = user_id;
end;
$$ language plpgsql security definer;
```

This acts as the backend mock needed for this.
