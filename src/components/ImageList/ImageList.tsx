import React, { useEffect } from "react";
import { XIcon } from "lucide-react";
import { getFilePath } from "@/lib/storageFile";
import ImagePreview from "./ImagePreview";

interface ImageListProps {
  data?: (string | File)[];
  showRemove?: boolean;
  onRemove?: (idx: number) => void;
}

const getUrlStringList = async (files?: (string | File)[]) => {
  if (!files || files.length === 0) {
    return [];
  }

  let res: string[] = [];

  for await (const item of files) {
    if (item instanceof File) {
      res.push(URL.createObjectURL(item));
    } else {
      const path = await getFilePath(item);
      res.push(path);
    }
  }

  return res;
};

const ImageList: React.FC<ImageListProps> = ({
  data,
  showRemove,
  onRemove,
}) => {
  const [urlStringList, setUrlStringList] = React.useState<string[]>([]);

  useEffect(() => {
    getUrlStringList(data).then((res) => {
      setUrlStringList(res);
    });
  }, [data]);

  if (!urlStringList || urlStringList.length == 0) {
    return null;
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {urlStringList.map((url, idx) => (
        <div key={idx} className="relative group">
          <ImagePreview urls={urlStringList} currentIdx={idx}>
            <img
              className="w-16 h-16 object-cover rounded-sm cursor-pointer"
              src={url}
              alt=""
            />
          </ImagePreview>
          {showRemove && (
            <span
              onClick={() => onRemove?.(idx)}
              className="absolute bg-gray-500 rounded-full right-[-4px] top-[-4px] p-1 hidden group-hover:block cursor-pointer"
            >
              <XIcon className="w-3 h-3 text-white" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageList;
