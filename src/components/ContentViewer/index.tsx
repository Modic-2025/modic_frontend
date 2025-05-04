"use client";
import { Art_thumbnail } from "@/types/Art";
import { useEffect, useState } from "react";
import ArtCard from "@/components/ArtCard";

type gridType = 2 | 3 | 4 | 5 | 6;
type artsByGridType = Array<Array<Art_thumbnail>>;

const ContentViewer = (props: {
  grid: gridType;
  arts: Array<Art_thumbnail>;
}) => {
  const [arts, setArts] = useState<Array<Art_thumbnail>>(props.arts);
  const [grid, setGrid] = useState<gridType>(props.grid);
  const [artsByGrid, setArtsByGrid] = useState<artsByGridType>();

  // // Setter
  // useEffect(() => {
  //   setArts(props.params.arts);
  //   setGrid(props.params.grid);
  // }, [props.params.arts, props.params.grid]);

  useEffect(() => {
    if (arts.length > 0 && grid) {
      const artsByGrid: artsByGridType = [];
      arts.map((art, index) => {
        console.log("art :>> ", art, ", index :>> ", index);
        const gridIndex = index % grid;
        if (artsByGrid[gridIndex]) {
          artsByGrid[gridIndex].push(art);
        } else {
          artsByGrid[gridIndex] = [art];
        }
      });

      console.log("artsByGrid :>> ", artsByGrid);
      setArtsByGrid(artsByGrid);
    }
  }, [arts, grid]);

  return (
    <div className={`content-viewer grid grid-cols-2 gap-4`}>
      {artsByGrid &&
        artsByGrid.map((_, index) => (
          <>
            {_.map((art, index) => (
              <div key={index} className="">
                <ArtCard key={index} data={art} />
              </div>
            ))}
          </>
        ))}
    </div>
  );
};

export default ContentViewer;
