import { create } from 'zustand';

const usePatientStore = create((set) => ({
    googleSheetId: null,
    setGoogleSheetId: (id) => set(() => ({ googleSheetId: id })),
    patients: [],
    addPatient: (patient) =>
        set((state) => ({ patients: [...state.patients, patient] })),
    editPatient: (id, updatedPatient) =>
        set((state) => ({
            patients: state.patients.map((patient) =>
                patient["Patient ID"] === id ? { ...patient, ...updatedPatient } : patient
            ),
        })),
    removePatient: (id) =>
        set((state) => ({
            patients: state.patients.filter(
                (patient) => patient["Patient ID"] !== id
            ),
        })),
    importPatients: (patientsData) => set(() => ({ patients: patientsData })),
    fetchPatients: async () => {            
        
        try {
            // const response = await fetch(`${process.env.SERVER_URL}/api/sheets/${sessionStorage.getItem('googleSheetId')}`);
            const response = await fetch('http://localhost:4000/api/sheets/' + sessionStorage.getItem('googleSheetId'));
            if (!response.ok) {
                throw new Error('Failed to fetch patients data');
            }
            const data = await response.json();
            console.log('Data:', );
            set(() => ({ patients: data }));
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    },
}));

export default usePatientStore;
