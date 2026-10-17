//will map comments with comment card

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Comment } from "./comment.interface";
import { getAllComments } from "./comment.services";
import CommentCard from "./CommentCard";
import { ListBox, Select } from "@heroui/react";
import CreateCommentCard from "./CreateComment";

export default function Comments({ postId }: { postId: string }) {

    const [sortBy, setSortBy] = useState<"most-relevant" | "newest">("most-relevant");
    const { data: commentsData, error } = useQuery({
      queryKey: ["comments", postId],
      queryFn: () => getAllComments(postId),
    });
    const allComments: Comment[] = commentsData?.comments ?? [];
    const commentsCount = commentsData?.total ?? 0;

    const sortedComments = useMemo(() => {
      const comments = [...allComments];
      const getTimestamp = (comment: Comment) => {
        const timestamp = new Date(comment.createdAt).getTime();
        return Number.isNaN(timestamp) ? 0 : timestamp;
      };

      if (sortBy === "newest") {
        return comments.sort((a, b) => getTimestamp(b) - getTimestamp(a));
      }

      return comments.sort((a, b) => {
        const engagementDifference =
          (b.likes?.length ?? 0) + b.repliesCount -
          ((a.likes?.length ?? 0) + a.repliesCount);
        return engagementDifference || getTimestamp(b) - getTimestamp(a);
      });
    }, [allComments, sortBy]);
  return (
    <div className="mt-3 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
        <div className="flex justify-between m-5 p-5 bg-white/80 dark:bg-zinc-950/70 rounded-4xl">
            <div className="flex gap-3 items-center">
                <p className="font-bold text-xs">Comments</p>
                <div className="bg-zinc-200 dark:bg-zinc-800 rounded-full w-5 h-5 flex items-center justify-center">
                <span className="text-xs font-bold text-accent">{commentsCount}</span>
                </div>
            </div>
            <div>
                <Select
                  aria-label="Sort comments"
                  selectedKey={sortBy}
                  onSelectionChange={(key) => {
                    if (key === "most-relevant" || key === "newest") {
                      setSortBy(key);
                    }
                  }}
                >
                            <Select.Trigger>
                              <Select.Value />
                              <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                              <ListBox>
                                <ListBox.Item id="most-relevant" textValue="most-relevant">
                                  Most Relevant
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                                <ListBox.Item id="newest" textValue="newest">
                                  Newest
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                              </ListBox>
                            </Select.Popover>                
                          </Select>
            </div>
        </div>
      {error && <p className="px-5 pb-3" role="alert">Failed to load Comments. Please try again.</p>}
      {sortedComments.map((Comment) => (
              <CommentCard key={Comment._id} comment={Comment} />
        ))}
      <CreateCommentCard postId={postId}/>  
    </div>
  )
}
