const FOLLOWED = "팔로우 취소";
const UNFOLLOWED = "팔로우";

const commonClassNames = "px-2 py-0 h-8 rounded-lg whitespace-nowrap text-sm";
const followedClassNames = "border border-(--color-gray-2)";
const unFollowedClassNames = "bg-(--color-main) text-white";
// state === false: unfollowed
// state === true: followed
const FollowButton = ({ state }: { state: boolean }) => (
  <button
    className={`${commonClassNames} ${state ? followedClassNames : unFollowedClassNames}`}
  >
    {state ? FOLLOWED : UNFOLLOWED}
  </button>
);

export default FollowButton;
