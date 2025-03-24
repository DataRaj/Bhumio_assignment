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
}));

export default usePatientStore;
