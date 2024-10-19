import { db } from "@/models/db";
import type { IDesk, IDeskSkeleton } from "@/models/desk";
import Desk from "@/models/desk";
import { useObservable } from "@vueuse/rxjs";
import { liveQuery } from "dexie";
import { computed, type Ref } from "vue";

export function useDesk () {
  const desks: Readonly<Ref<IDesk[]>> = useObservable(
    liveQuery(() => db.desks.toArray()),
  );

  const listDesks = computed(() => {
    if (!desks.value) return [];
    return desks.value.map(desk => Desk.toModel(desk));
  });

  async function addDesk (desk: Desk) {
    await Desk.create(desk);
  }


  async function updateDesk (desk: Desk) {
    await Desk.updateDesk(desk);
  }

  async function deleteDesk (id: string) {
    await Desk.deleteDesk(id);
  }


  return {
    listDesks,
    addDesk,
    updateDesk,
    deleteDesk
  };
}