import React, { useState, useEffect, useRef, type ElementRef } from "react";

const TagsContainer = ({ tags }: { tags: Array<string> }) => {
  const containerRef = useRef<ElementRef<"div">>(null); // Reference to the container
  const [visibleTags, setVisibleTags] = useState(tags.length); // How many tags are visible
  const [hiddenCount, setHiddenCount] = useState(0); // Hidden tags count

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let currentWidth = 0;
        let count = 0;

        // Calculate how many tags fit into the container
        for (let i = 0; i < tags.length; i++) {
          const tagElement = document.getElementById(`tag-${i}`);
          if (tagElement) {
            currentWidth += tagElement.offsetWidth + 8; // Account for margin
            if (currentWidth > containerWidth) {
              break; // Stop when the container is full
            }
            count++;
          }
        }

        setVisibleTags(count); // Set the number of visible tags
        setHiddenCount(tags.length - count); // Set how many tags are hidden
      }
    };

    handleResize(); // Call on mount

    window.addEventListener("resize", handleResize); // Call on window resize
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [tags]);

  return (
    <div
      className="flex gap-1 [@media(min-width:1400px)]:gap-2 overflow-hidden"
      ref={containerRef}
    >
      {tags.slice(0, visibleTags).map((tag, index) => (
        <span
          key={index}
          id={`tag-${index}`}
          className="rounded-lg bg-gray-100 whitespace-nowrap px-2 py-1 font-semibold text-gray-700 text-[10px] [@media(min-width:1400px)]:text-xs"
        >
          {tag}
        </span>

        // <Badge key={index} id={`tag-${index}`} variant="secondary">
        // 	{tag}
        // </Badge>
      ))}
      {hiddenCount > 0 && (
        <span className="rounded-lg bg-gray-100 px-2 py-1 font-semibold text-gray-700 text-xs">
          +{hiddenCount}
        </span>

        // <Badge variant="secondary">+{hiddenCount}</Badge>
      )}
    </div>
  );
};

export default TagsContainer;
