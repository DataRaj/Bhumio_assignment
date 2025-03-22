import zustand  from 'zustand';

const useFormStore = zustand((set) => ({
  form: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  setForm: (form) => set(() => ({ form })),
  resetForm: () => set(() => ({ form: { name: '', email: '', password: '', confirmPassword: '' } })),
}));

export default useFormStore;
