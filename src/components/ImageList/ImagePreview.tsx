import * as React from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-auto max-w-[90vw] max-h-[90vh] overflow-scroll">
        <img
          className="object-cover rounded-sm"
          src={urls[currentIdx]}
          alt=""
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreview;
