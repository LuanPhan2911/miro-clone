"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import qs from "query-string";
import { useRouter } from "next/navigation";
export const SearchInput = () => {
  const [value, setValue] = useState("");
  const [debounceValue, setDebounceValue] = useDebounceValue("", 500);
  const router = useRouter();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setDebounceValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: {
          search: debounceValue,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url);
  }, [debounceValue, router]);

  return (
    <div className="w-full relative">
      <Search className="absolute  top-1/2 left-3 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="w-full max-w-[516px] pl-9"
        placeholder="Search boards"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
