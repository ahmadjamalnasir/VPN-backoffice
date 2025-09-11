import { Grid, Paper, Typography } from '@mui/material'

const Dashboard = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome to the VPN Backoffice. Use the sidebar to navigate.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Dashboard


