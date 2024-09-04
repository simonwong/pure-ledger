import * as React from "react";
import { Modal } from "@easy-shadcn/react";

interface ImagePreviewProps {
  urls: string[];
  currentIdx: number;
}

const ImagePreview: React.FC<React.PropsWithChildren<ImagePreviewProps>> = ({
  urls,
  currentIdx,
  children,
}) => {
  return (
    <Modal
      contentProps={{
        className: "w-auto max-w-[90vw] max-h-[90vh] overflow-scroll",
      }}
      content={
        <img
          className="object-cover rounded-sm"
          src={urls[currentIdx]}
          alt=""
        />
      }
    >
      {children}
    </Modal>
  );
};

export default ImagePreview;
