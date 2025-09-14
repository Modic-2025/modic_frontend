"use client";

const Title = ({ specificValue }: { specificValue?: string }) => {
  // const [title, setTitle] = useState<string>(specificValue ?? "");
  // const [userId, setUserId] = useState<string>(); // long -> string으로 관리
  return (
    <div className="w-full text-center">
      <h1 className="text-lg font-bold text-center">{specificValue}</h1>
    </div>
  );
};

export default Title;
