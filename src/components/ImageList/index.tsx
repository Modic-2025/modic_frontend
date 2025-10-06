"use client";
import UploadImage from "@/APIs/ImageUploader";
import "swiper/css";
import { ImageType } from "@/types/Art";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

// READ-ONLY: Only reads
// EDIT: Full editable mode
// ONLY-ONE: Appends independently, and only one image
type Mode = "READ-ONLY" | "EDIT" | "ONLY-ONE";

type ImageListProps = enableEditType & {
  items?: ImageType[]; // for init
  max?: number;
  onChange?: (images: ImageType[]) => void;
  onDelete?: (id: number) => void;
};

/**
 * ImageList
 * mode: "ONLY-ONE"
 * - component works as a presentational component, fetch & sync items from parent component
 */
const ImageList = ({
  items,
  mode = "READ-ONLY",
  max = DEFAULT_MAX_IMAGES,
  onChange,
  onDelete,
}: ImageListProps) => {
  const [images, setImages] = useState<ImageType[]>(items || []);

  // Flags
  const editMode = mode === "EDIT";
  const readonlyMode = mode === "READ-ONLY";
  const onlyoneMode = mode === "ONLY-ONE";

  // Only fetch in mode === "ONLY-ONE"
  useEffect(() => {
    if (mode === "ONLY-ONE" && items) {
      setImages(items);
    }
  }, [items]);

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
        UploadImage(
          newFiles[i],
          ([imageUrl, , imageId], e) => {
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
          },
          "POST"
        );
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

  // On delete Cell
  const _onDelete = (id: number) => () => {
    if (onlyoneMode && onDelete) {
      // ONLY-ONE
      onDelete(id);
      return;
    }
    setImages((prev) => prev.filter((item) => Number(item.imageId) !== id));
  };

  // Render as read-only mode
  if (readonlyMode) {
    return (
      <CellWrapper
        images={images}
        onChangeImage={onChangeImage}
        max={max}
        mode={mode}
      />
    );
  }

  // Render as only-one, append independently mode
  if (onlyoneMode) {
    return (
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
            onChangeImage={onChangeImage}
            max={max}
            mode={mode}
            onDelete={_onDelete}
          />
        </SortableContext>
      </DndContext>
    );
  }

  // Render as full-edit mode
  return (
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
          onChangeImage={onChangeImage}
          max={max}
          mode={mode}
          onDelete={_onDelete}
        />
      </SortableContext>
    </DndContext>
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
  mode,
  onDelete,
}: CellWrapperProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Rendering image upload button when "EDIT" mode
  const isRenderUploadCell = mode === "EDIT";
  const isOnlyoneMode = mode === "ONLY-ONE";

  return (
    <div className="w-full h-[90px] overflow-x-auto pt-[9px] flex">
      {isRenderUploadCell && (
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
          isEdit={isRenderUploadCell || isOnlyoneMode}
          onDelete={onDelete}
          isThumbnail={!isOnlyoneMode && i === 0}
        >
          <Image
            src={imageUrl}
            alt={imageUrl}
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
    isEdit: boolean;
    isThumbnail: boolean;
  };
const Cell = ({ id, children, isEdit, onDelete, isThumbnail }: CellProps) => {
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
      {isEdit && (
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
      {isThumbnail && isEdit && (
        <div className="absolute flex justify-center items-center text-center w-full h-full bg-black/20 rounded-xl">
          <p className="font-bold text-(--color-main)">대표</p>
        </div>
      )}
    </div>
  );
};

type onDeleteType = {
  onDelete?: (id: number) => () => void;
};

// common type for components
type enableEditType = {
  mode?: Mode;
};

// Icon
const CameraIcon = () => (
  <Image src="/camera.svg" alt="사진 업로드" width={48} height={48} />
);

export default ImageList;
