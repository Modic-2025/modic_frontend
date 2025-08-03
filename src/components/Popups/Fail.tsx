import Confirm from "./Confirm";

type FailProps = {
  title: string;
  desc?: string;
  noBg?: boolean;
  onCancel?: () => void;
};

const Fail = ({ title, desc, noBg, onCancel }: FailProps) => (
  <Confirm
    title={title}
    desc={desc}
    noBg={noBg}
    onCancel={onCancel}
    cancelText=""
    confirmText=""
  />
);

export default Fail;
