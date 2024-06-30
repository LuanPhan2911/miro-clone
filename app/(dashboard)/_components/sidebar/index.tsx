import { ListOrg } from "./list-org";
import { NewOrgButton } from "./new-org";

export const Sidebar = () => {
  return (
    <aside
      className="flex flex-col fixed left-0 z-[1] h-full w-[60px] 
    gap-y-4 items-center pt-2 bg-blue-950"
    >
      <ListOrg />
      <NewOrgButton />
    </aside>
  );
};
