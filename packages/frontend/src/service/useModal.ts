import AddDesk from "@/components/homeview/AddDesk.vue";
import { useModalStore } from "@/components/modal/service/useModalStore";
import type Desk from "@/models/desk";

export function useModal () {
  const { openModal } = useModalStore();
  function useDeskModal (desk?: Desk) {
    openModal({
      component: AddDesk,
      title: !!desk?.id ? "Edit Desk" : "Add Desk",
      props: { desk } || {},
      closeOnClick: true
    });
  }
  return {
    useDeskModal
  };
}
export default useModal;