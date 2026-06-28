import { FC } from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  Component: any;
  itemData: any;
  refetch?: any;
  big?: boolean;
  type?: string
  regime?: string
};

const EditModal: FC<Props> = ({ setOpen, Component, itemData, refetch, big, type,regime }) => {
  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Check if the click occurred outside the Box
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center w-full mx-auto justify-center overflow-x-hidden bg-[#00000080] fade-in"
      onClick={handleClose}
    >
      <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 ${big ? `w-[800px]` : "w-[550px]"}  max-md:w-[300px] bg-white rounded-md shadow p-4 outline-none z-50`}>
      <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" className="w-[80px]"/>
      </div>
      <Component setOpen={setOpen} itemData={itemData} refetch={refetch} type={type} regime={regime}/>
      </div>
    </div>
  );
};

export default EditModal;
