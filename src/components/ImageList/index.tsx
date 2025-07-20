"use client";
import UploadImage from "@/APIs/ImageUploader";
import "swiper/css";
import { ImageType } from "@/types/Art";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useIsMounted from "@/hooks/UseIsMounted";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

const DEFAULT_MAX_IMAGES = 8;

// const FAKE_IMAGES_DATA: ImageType[] = [
//   {
//     imageUrl:
//       "https://modic-main.s3.ap-northeast-2.amazonaws.com/profile/452c5f09-5379-46ee-941c-61deebf7f4ab-%E1%84%86%E1%85%A1%E1%86%BC%E1%84%80%E1%85%A9%E1%86%B7.jpeg",
//     imageId: "1",
//   },
//   {
//     imageUrl:
//       "https://syncspotmain.s3.amazonaws.com/post/2ac8443f-38a4-42ad-a593-584e98974cc9-ruined-boy.png",
//     imageId: "2",
//   },
//   {
//     imageUrl:
//       "https://modic-main.s3.ap-northeast-2.amazonaws.com/profile/65507a26-fa1a-4881-9478-06824ee397c9-17897e7bcc221abee.jpeg",
//     imageId: "3",
//   },
//   {
//     imageUrl:
//       "https://modic-main.s3.ap-northeast-2.amazonaws.com/profile/452c5f09-5379-46ee-941c-61deebf7f4ab-%E1%84%86%E1%85%A1%E1%86%BC%E1%84%80%E1%85%A9%E1%86%B7.jpeg",
//     imageId: "4",
//   },
//   {
//     imageUrl:
//       "https://modic-main.s3.ap-northeast-2.amazonaws.com/profile/452c5f09-5379-46ee-941c-61deebf7f4ab-%E1%84%86%E1%85%A1%E1%86%BC%E1%84%80%E1%85%A9%E1%86%B7.jpeg",
//     imageId: "5",
//   },
//   {
//     imageUrl:
//       "https://syncspotmain.s3.amazonaws.com/post/2ac8443f-38a4-42ad-a593-584e98974cc9-ruined-boy.png",
//     imageId: "6",
//   },
// ];

type ImageListProps = enableEditType & {
  items?: ImageType[]; // for init
  max?: number;
  onChange?: (images: ImageType[]) => void;
};

const ImageList = ({
  items,
  enableEdit,
  max = DEFAULT_MAX_IMAGES,
  onChange,
}: ImageListProps) => {
  const [images, setImages] = useState<ImageType[]>(items || []);
  // const [images, setImages] = useState<ImageType[]>(items || FAKE_IMAGES_DATA);

  // Trigging onChange callback
  useEffect(() => {
    onChange && onChange(images);
  }, [images]);

  // For dnd
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Event listener
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      if (images.length + newFiles.length > max) {
        alert(`최대 ${max}개의 이미지만 업로드할 수 있습니다.`);
        return;
      }

      const { length } = newFiles;
      for (let i = 0; i < length; i++) {
        UploadImage(newFiles[i], ([imageUrl, imageId], e) => {
          if (e) {
            console.error("Error occured");
            return;
          }
          setImages((prev) => [
            ...prev,
            {
              imageUrl: imageUrl,
              imageId: imageId,
            },
          ]);
        });
      }
    }
  };

  // DragEnd event handler
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active.id !== over.id) {
      setImages((items) => {
        let oldIndex = -1;
        let newIndex = -1;
        items.forEach((item) => {
          if (Number(item.imageId) === active.id) {
            oldIndex = items.indexOf(item);
          }
          if (Number(item.imageId) === over.id) {
            newIndex = items.indexOf(item);
          }
        });

        if (oldIndex === -1 || newIndex === -1) {
          console.error("Invalid drag indices");
          return items;
        }

        return arrayMove(images, oldIndex, newIndex);
      });
    }
  };

  const onDelete = (id: number) => () => {
    console.log("onDelete id :>> ", id);
    setImages((prev) => prev.filter((item) => Number(item.imageId) !== id));
  };

  // Render as read-only
  if (!enableEdit) {
    return (
      <CellWrapper
        images={images}
        onChangeImage={onChangeImage}
        max={max}
        enableEdit={enableEdit}
      />
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <SortableContext
          items={images.map((item) => Number(item.imageId))}
          strategy={horizontalListSortingStrategy}
        >
          <CellWrapper
            images={images}
            max={max}
            enableEdit={enableEdit}
            onChangeImage={onChangeImage}
            onDelete={onDelete}
          />
        </SortableContext>
      </DndContext>
    </>
  );
};

type CellWrapperProps = enableEditType &
  onDeleteType & {
    images: ImageType[];
    onChangeImage?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    max?: number;
  };
const CellWrapper = ({
  images,
  onChangeImage,
  max,
  enableEdit,
  onDelete,
}: CellWrapperProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full h-[90px] overflow-x-auto pt-[9px] flex">
      {enableEdit && (
        <Cell key={0} id={0}>
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <CameraIcon />
            <p>
              <span>{images.length}</span>/<span>{max}</span>{" "}
            </p>
            <input
              type="file"
              className="hidden"
              onChange={onChangeImage}
              ref={imageInputRef}
            />
          </label>
        </Cell>
      )}
      {images.map(({ imageUrl, imageId }, i) => (
        <Cell
          key={imageId}
          id={Number(imageId)}
          enableEdit={enableEdit}
          onDelete={onDelete}
        >
          <Image
            src={imageUrl}
            alt={imageId}
            fill={true}
            style={{ objectFit: "cover" }}
            className={`rounded-lg`}
          />
        </Cell>
      ))}
    </div>
  );
};

/**
 * Cell component
 */
type CellProps = enableEditType &
  onDeleteType & {
    id: number;
    children: React.ReactNode;
  };
const Cell = ({ id, children, enableEdit, onDelete }: CellProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative inline-flex w-[80px] h-[80px] flex-col items-center justify-center rounded-lg content-center text-center bg-gray-200 cursor-pointer flex-shrink-0 flex-grow-0 mr-3"
    >
      {enableEdit && (
        <Image
          src="/X.svg"
          alt="delete"
          className="absolute z-1 top-[-9] right-[-9] cursor-pointer"
          onClick={onDelete && onDelete(id)}
          // onClick={onDelete && onDelete(id)}
          width={18}
          height={18}
        />
      )}
      <div {...listeners}>{children}</div>
    </div>
  );
};

type onDeleteType = {
  onDelete?: (id: number) => () => void;
};

// common type for components
type enableEditType = {
  enableEdit?: boolean;
};

// Icon
const CameraIcon = () => (
  <Image src="/camera.svg" alt="사진 업로드" width={48} height={48} />
);

export default ImageList;
