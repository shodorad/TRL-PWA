import { CssBaseline, ThemeProvider } from '@mui/material'
import { StyleSheetManager } from 'styled-components'
import { RouterProvider } from 'react-router-dom'
import theme from '@/themes'
import { router } from '@/routes'
import { AuthProvider } from '@/contexts/AuthContext'
import { VehicleProvider } from '@/contexts/VehicleContext'
import { DeviceProvider } from '@/contexts/DeviceContext'
import { PlanProvider } from '@/contexts/PlanContext'
import { globalStyles } from '@/styles/globals'

const App = () => (
  <StyleSheetManager>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{globalStyles}</style>
      <AuthProvider>
        <VehicleProvider>
          <DeviceProvider>
            <PlanProvider>
              <RouterProvider router={router} />
            </PlanProvider>
          </DeviceProvider>
        </VehicleProvider>
      </AuthProvider>
    </ThemeProvider>
  </StyleSheetManager>
)

export default App
