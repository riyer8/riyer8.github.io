import { Fragment, useState } from 'react';
import './CollapsibleTags.css';

const VISIBLE_LIMIT = 2;

// Keep a filtered tag in the collapsed pair so the active badge stays visible.
export function visibleTags(tags, { expanded, activeTag }) {
  const list = tags || [];
  if (expanded || list.length <= VISIBLE_LIMIT) return list;
  const head = list.slice(0, VISIBLE_LIMIT);
  if (activeTag && list.includes(activeTag) && !head.includes(activeTag)) {
    return [list[0], activeTag];
  }
  return head;
}

const CollapsibleTags = ({
  tags = [],
  activeTag = null,
  renderTag,
  className = '',
  ...containerProps
}) => {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = Math.max(0, tags.length - VISIBLE_LIMIT);
  const showToggle = hiddenCount > 0;
  const visible = visibleTags(tags, { expanded, activeTag });

  const classes = [
    'collapsible-tags',
    expanded ? 'collapsible-tags--expanded' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...containerProps}>
      {visible.map((tag) => (
        <Fragment key={tag}>{renderTag(tag)}</Fragment>
      ))}
      {showToggle ? (
        <button
          type="button"
          className="tag-overflow"
          aria-expanded={expanded}
          aria-label={expanded ? 'Show fewer tags' : `Show ${hiddenCount} more tags`}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((open) => !open);
          }}
        >
          {expanded ? '–' : `+${hiddenCount}`}
        </button>
      ) : null}
    </div>
  );
};

export default CollapsibleTags;
