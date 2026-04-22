import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './pages/AppLayout'
import { HomePage } from './pages/HomePage'
import { FlightResultsPage } from './pages/FlightResultsPage'
import { FlightDetailsPage } from './pages/FlightDetailsPage'
import { CheckoutLayout } from './pages/CheckoutLayout'
import { PassengersPage } from './pages/PassengersPage'
import { SeatsPage } from './pages/SeatsPage'
import { ExtrasPage } from './pages/ExtrasPage'
import { PaymentPage } from './pages/PaymentPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { AccountPage } from './pages/AccountPage'
import { TripsPage } from './pages/TripsPage'
import { TripDetailPage } from './pages/TripDetailPage'
import { CheckInPage } from './pages/CheckInPage'
import { StaysPage } from './pages/StaysPage'
import { StaysResultsPage } from './pages/StaysResultsPage'
import { StayDetailPage } from './pages/StayDetailPage'
import { DestinationsPage } from './pages/DestinationsPage'
import { HelpCenterPage } from './pages/HelpCenterPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/flights" element={<FlightResultsPage />} />
          <Route path="/flights/:id" element={<FlightDetailsPage />} />
          <Route element={<CheckoutLayout />}>
            <Route path="/book" element={<Navigate to="/book/passengers" replace />} />
            <Route path="/book/passengers" element={<PassengersPage />} />
            <Route path="/book/seats" element={<SeatsPage />} />
            <Route path="/book/extras" element={<ExtrasPage />} />
            <Route path="/book/payment" element={<PaymentPage />} />
          </Route>
          <Route path="/book/confirmation" element={<ConfirmationPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/:pnr" element={<TripDetailPage />} />
          <Route path="/trips/:pnr/check-in" element={<CheckInPage />} />
          <Route path="/stays" element={<StaysPage />} />
          <Route path="/stays/results" element={<StaysResultsPage />} />
          <Route path="/stays/:id" element={<StayDetailPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
