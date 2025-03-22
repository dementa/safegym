import { create } from 'zustand';
import { db } from '../firebaseConfig'; // Import Firebase Firestore instance
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  loading: false,

  // Fetch Available Slots from Firestore
  fetchAppointments: async () => {
    set({ loading: true });
    try {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ appointments, loading: false });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      set({ loading: false });
    }
  },

  // Book an Appointment
  bookAppointment: async (appointmentData) => {
    set({ loading: true });
    try {
      const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
      set({ 
        appointments: [...get().appointments, { id: docRef.id, ...appointmentData }],
        loading: false 
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      set({ loading: false });
    }
  },

  // Cancel an Appointment
  cancelAppointment: async (appointmentId) => {
    set({ loading: true });
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
      set({ 
        appointments: get().appointments.filter(app => app.id !== appointmentId),
        loading: false 
      });
    } catch (error) {
      console.error('Error canceling appointment:', error);
      set({ loading: false });
    }
  },

  // Reschedule an Appointment
  rescheduleAppointment: async (appointmentId, newDate) => {
    set({ loading: true });
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { date: newDate });
      set({ 
        appointments: get().appointments.map(app => 
          app.id === appointmentId ? { ...app, date: newDate } : app
        ),
        loading: false 
      });
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      set({ loading: false });
    }
  }
}));
