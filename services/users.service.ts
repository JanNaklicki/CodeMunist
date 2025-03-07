import { Tables } from "@/database.types";
import { supabase } from "@/lib/supabase";
type Profile = Tables<"Profiles">;
type UserPrivileges = Tables<"UserPrivileges">;

export class UsersService {
  async GetProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("Profiles")
      .select("*")
      .eq("id", userId)
      .single<Profile>();
    if (error) {
      return null;
    }
    return data;
  }

  async GetPrivelages(userId: string): Promise<UserPrivileges | null> {
    const { data, error } = await supabase
      .from("UserPrivileges")
      .select("*")
      .eq("id", userId)
      .single<UserPrivileges>();

    if (error) {
      return null;
    }
    return data;
  }
}
