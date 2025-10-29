/**
 * 읽기 전용 필드 컴포넌트
 *
 * 편집 불가능한 정보를 표시할 때 사용합니다.
 * disabled input 대신 사용하여 접근성과 의미를 명확히 합니다.
 */

type ReadOnlyFieldProps = {
  title: string;
  value: string;
  placeholder?: string;
};

const ReadOnlyField = ({ title, value, placeholder }: ReadOnlyFieldProps) => {
  return (
    <div>
      <label className="block text-md font-semibold mb-2">{title}</label>
      <div
        className="w-full h-[58px] px-4 rounded-[8px] bg-gray-100
                   flex items-center text-gray-700 text-[18px] font-medium font-[Pretendard]"
        style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
      >
        {value || (
          <span className="text-[#9E9FAD]">{placeholder || ""}</span>
        )}
      </div>
    </div>
  );
};

export default ReadOnlyField;
