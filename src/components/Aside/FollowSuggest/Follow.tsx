import { SearchField} from "@heroui/react";
import {Persons} from '@gravity-ui/icons';
import UserFollowCard from "./UserFollowCard/UserFollowCard";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getFollowSuggest, searchFollowSuggestions } from "./follow-suggest.services";
import { useEffect, useState } from "react";


export default function Follow() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const isSearching = debouncedSearchTerm.length > 0;
  const {
    data: followSuggestion = [],
    error,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: ["followSuggestions", isSearching ? debouncedSearchTerm : "default"],
    queryFn: () => isSearching
      ? searchFollowSuggestions(debouncedSearchTerm)
      : getFollowSuggest(5),
  });
  const isSearchSettled = searchTerm.trim() === debouncedSearchTerm;
  const canRenderSuggestions = isSearchSettled && isSuccess && !isFetching;
  
  return (
    <div className="w-full flex-col gap-6 border border-zinc-900/10 bg-white/80 text-zinc-900 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-white p-5 rounded-4xl">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          <Persons className="size-5 text-accent" />
          <h3 className="font-bold">Suggested Friends</h3>
        </div>
        <div className="bg-zinc-200 dark:bg-zinc-700 rounded-full w-6 h-6 flex items-center justify-center">
        <span className="text-sm font-bold text-accent">{followSuggestion.length}</span>
        </div>
      </div>
      <SearchField
        name="search"
        aria-label="Search suggested friends"
        className={'mb-4'}
        value={searchTerm}
        onChange={setSearchTerm}
      >
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input className={'w-full'} placeholder="Search..." />
        <SearchField.ClearButton onClick={() => setSearchTerm("")} />
      </SearchField.Group>
    </SearchField>
    {error && <p role="alert">Failed to load suggested friends.</p>}
    {(!isSearchSettled || isFetching) && (
      <p role="status" className="mb-3 text-xs text-zinc-500">Searching suggestions...</p>
    )}
    {canRenderSuggestions && followSuggestion.map(suggestion => (
      <UserFollowCard key={suggestion._id} suggestion={suggestion} />
    ))}
    {canRenderSuggestions && followSuggestion.length === 0 && (
      <p className="py-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
        {isSearching ? "No suggested friends match your search." : "No suggestions available."}
      </p>
    )}
    <Link to={'/suggestions'} >
      <div className="rounded-3xl bg-accent text-white text-center py-1.5 font-bold mt-4  hover:bg-[#d13f00]">
        View More
      </div>
    </Link>
    </div>
  )
}
