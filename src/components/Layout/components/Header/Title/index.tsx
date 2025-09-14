"use client";

const Title = ({ specificValue }: { specificValue?: string }) => {
  return (
    <div className="w-full text-center">
      <h1 className="text-lg font-bold text-center">{specificValue}</h1>
    </div>
  );
};

export default Title;
