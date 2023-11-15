import { AdminLayout } from "@/components/layouts";
import { PeopleOutline } from "@mui/icons-material";
import React,{ useEffect,useState} from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Grid, MenuItem, Select } from "@mui/material";
import useSWR from "swr";
import { IUser } from "@/interfaces";
import { tesloApi } from "@/api";

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([])
  
  useEffect(() => {
    
    if(data){
      setUsers(data)
    }

  }, [])
  
  if (!data && !error) {
    return <></>;
  }
  const onRolUpdated = async( userId: string, newRole: string ) => {
    const previousUsers = users.map( user => ({ ...user }));
    const updatedUsers = users.map(( user ) => ({
      ...user,
      role: userId === user._id ? newRole : user.role

    }))
    setUsers(updatedUsers);
    try {
      await tesloApi.put('/admin/users',{ userId,role: newRole })

    } catch (error) {
      setUsers(previousUsers);
      alert('Not updated user')
    }
  }
  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "name",
      headerName: "Name",
      width: 300,
    },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Select value={ params.row.role } label='Rol' sx={{ width: '300px'}} onChange={ ({target}) => onRolUpdated(params.row.id,target.value)}>
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='client'>Client</MenuItem>
              <MenuItem value='super-user'>Super User</MenuItem>
              <MenuItem value='SEO'>SEO</MenuItem>

          </Select>
        )
      },
    },
  ];

  const rows: any[] = data!.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));
  return (
    <AdminLayout
      title="Users"
      subtitle="Mantein users"
      icon={<PeopleOutline />}
    >
      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 25]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
