import { Tables } from "@/database.types";
import { supabase } from "@/lib/supabase";
type Items = Tables<"Items">;

export class ItemsService {
    async GetAllItems(): Promise<Items[] | null> {
    const { data, error } = await supabase
        .from("Items")
        .select("*")
        .order("name", { ascending: true });


    if (error) {
        return null;
    }
    return data;
    }

    //omit id from the item object
    async AddItem(item: Items): Promise<Items | null> {
        const { id, ...itemWithoutId } = item; // Omit id from the item object
        const { data, error } = await supabase
            .from("Items")
            .insert(itemWithoutId)
            .single<Items>();

        if (error) {
            return null;
        }
        return data;
    }

    async UpdateItem(item: Items): Promise<Items | null> {
        const { data, error } = await supabase
            .from("Items")
            .update(item)
            .match({ id: item.id })
            .single<Items>();

        if (error) {
            return null;
        }
        return data;
    }

    async UpdateAmmount(id: number, ammout: number): Promise<Items | null> {
        const { data, error } = await supabase
            .from("Items")
            .update({ amount: ammout })
            .match({ id: id })
            .single<Items>();
            console.log(error)
        if (error) {
            return null;
        }
        return data;
    }

    async DeleteItem(id: number): Promise<boolean> {
        const { error } = await supabase
            .from("Items")
            .delete()
            .match({ id: id });

        if (error) {
            return false;
        }
        return true;
    }

}
