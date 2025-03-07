// import { supabase } from "@/src/lib/supabase";

// export class AuthService {
//   async changePassword(newPassword: string) {
//     const { data, error } = await supabase.auth.updateUser({ password: newPassword });
//     if (error) {
//       throw error
//     }
//   }
//   async signUpWithEmail(email: string, password: string) {
//     const { data, error } = await supabase.auth.signUp({ email, password });
//     if (error) {
//       // console.error(error);
//       throw error;
//     }
//     return data;
//   }

//   async signInWithEmail(email: string, password: string) {
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) {
//       // console.error(error);
//       throw error;
//     }
//     return data;
//   }

//   async signOut() {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       // console.error(error);
//       throw error;
//     }
//   }

//   async sendPasswordResetEmail(email: string) {
//     const { error } = await supabase.auth.resetPasswordForEmail(email);
//     if (error) {
//       // console.error(error);
//       throw error;
//     }
//   }

//   async resendSignUp(email: string) {
//     const { error } = await supabase.auth.resend({
//       type: 'signup',
//       email: email
//     })
//     if (error) {
//       throw error;
//     }
//   }
// }
