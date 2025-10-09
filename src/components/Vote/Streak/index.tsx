const StreakClassname = "w-4 h-4 border-1 border-(--color-main) rounded-full";
const StreakActivate = "bg-(--color-main)";

const Streak = ({ value, max }: { value: number; max: number }) => {
  console.log("max :>> ", max);
  return (
    <ul className="flex gap-4 justify-center">
      {new Array(max).fill(0).map((_, i) => (
        <li
          className={`${StreakClassname} ${i < value && StreakActivate}`}
        ></li>
      ))}
    </ul>
  );
};

export default Streak;
