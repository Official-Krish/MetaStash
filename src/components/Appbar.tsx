import { Box } from "lucide-react";

const Appbar = () => {
  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex items-center gap-2">
        <Box className="size-8" />
        <div className="flex flex-col gap-4">
          <span className="tracking-tighter text-3xl font-extrabold text-primary flex gap-2 items-center text-white">
            MetaStash{" "}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Appbar;