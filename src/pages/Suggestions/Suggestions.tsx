import { ArrowLeft, Persons } from "@gravity-ui/icons";
import { SearchField } from "@heroui/react";
import { getFollowSuggest, searchFollowSuggestions } from "../../components/Aside/FollowSuggest/follow-suggest.services";
import { useQuery } from "@tanstack/react-query";
import UserFollowCard from "../../components/Aside/FollowSuggest/UserFollowCard/UserFollowCard";
import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function Suggestions() {
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
    queryKey: ["followSuggestionsPage", isSearching ? debouncedSearchTerm : "default"],
    queryFn: () => isSearching
      ? searchFollowSuggestions(debouncedSearchTerm)
      : getFollowSuggest(20),
  });
  const isSearchSettled = searchTerm.trim() === debouncedSearchTerm;
  const canRenderSuggestions = isSearchSettled && isSuccess && !isFetching;

  return (
    <div className="mx-auto mt-24 w-[calc(100%_-_1rem)] max-w-5xl rounded-3xl border border-zinc-900/10 bg-white/80 p-4 text-zinc-900 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-white sm:mt-28 sm:w-full sm:rounded-4xl sm:p-5">
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-white/15 dark:bg-zinc-800/70 dark:text-zinc-200 dark:hover:border-accent/50 dark:hover:text-accent"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back
      </Link>
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
        className="mb-4"
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {canRenderSuggestions && followSuggestion.map(suggestion => (
      <UserFollowCard key={suggestion._id} suggestion={suggestion}/>
    ))}
    </div>
    {canRenderSuggestions && followSuggestion.length === 0 && (
      <p className="py-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
        {isSearching ? "No users match your search." : "No suggestions available."}
      </p>
    )}
    </div>
  )
}
