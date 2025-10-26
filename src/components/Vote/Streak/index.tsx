import Image from "next/image";

const StreakClassname =
  "w-6 h-6 border-2 border-(--color-main) rounded-full bg-white z-1";
const StreakActivate = "bg-(--color-main) border-none";

const Streak = ({ value, max }: { value: number; max: number }) => {
  const remainValue = max - value; // remain correct answer count for receive free ticket
  return (
    <div className="motion-preset-fade motion-duration-750">
      <p className="block font-semibold mb-2">
        {remainValue}번 더 맞추면 무료 티켓!
      </p>
      <ul className="flex gap-4 justify-between items-center">
        <span className="absolute border-dashed border-2 border-(--color-main) w-[calc(90%-28px)]"></span>
        {new Array(max).fill(0).map((_, i) =>
          i < max - 1 ? (
            <li
              key={i}
              className={`${StreakClassname} ${i < value && StreakActivate}`}
            >
              {i < value && (
                <Image
                  src="/done_1.svg"
                  alt="check"
                  width="28"
                  height="28"
                  className="motion-preset-pop motion-duration-250"
                />
              )}
            </li>
          ) : (
            <li
              key={i}
              className="relative flex items-center rounded-full border-(--color-main)"
            >
              {/* <span className="absolute w-20 left-1/2 -translate-x-1/2 -top-10 bg-white px-2 py-1 rounded shadow text-sm ">
              {" "}
              무료 티켓!
            </span> */}
              <Image
                // src="/ticket_custom.svg"
                src="/ticket_main_color.svg"
                alt="/ticket_main_color.svg"
                // className="bg-white"
                width="28"
                height="28"
              />
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Streak;
