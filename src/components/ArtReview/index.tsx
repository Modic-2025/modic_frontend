import OptionDotted from "../Layout/components/Header/Option/dotted";
import Slider from "../Slider";
import UserInfo from "../UserInfo";

const ArtReview = ({
  userName,
  date,
  images,
  desc,
}: {
  userName: string;
  date: Date;
  images?: Array<String>;
  desc?: string;
}) => {
  const imagesExist = images && images.length > 0;
  return (
    <section className="pt-4">
      <div className="flex justify-between mb-[10px]">
        <UserInfo
          className="basis-3/10"
          title={userName}
          desc={`${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`}
        />
        <OptionDotted />
      </div>
      {imagesExist && <Slider items={images} type="PANORAMA" />}
      <p className="mt-2">{desc}</p>
    </section>
  );
};

export default ArtReview;
