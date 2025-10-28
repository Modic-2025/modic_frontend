"use client";
import { Handle, Position } from "reactflow";
import { PostNodeData } from "../../index";

// 노드(이미지)의 크기와 둥근 모서리 값 정의
export const NODE_WIDTH = 120;
export const NODE_HEIGHT = 160;
const BORDER_RADIUS = 10;

type PostNodeProps = {
  data: PostNodeData;
  onClick: (data: PostNodeData) => void;
};

// React Flow의 NodeProps 타입 사용
const PostNode = ({ data, onClick }: PostNodeProps) => {
  const nodeId = data.attributes.postId.toString();

  return (
    <div
      style={{
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      }}
      onClick={() => onClick && onClick(data)}
    >
      {/* 3. 부모 노드로부터 연결을 받는 Target Handle (상단) */}
      <Handle
        type="target"
        position={Position.Top}
        id={`target-${nodeId}`} // 고유 ID 부여 (옵션)
        style={{ background: "#555", top: "-5px" }} // 노드 경계선 밖으로 살짝 이동
        isConnectable={true}
      />
      {/* react-d3-tree와 달리 React Flow는 SVG가 아닌 HTML/React 컴포넌트를
        그대로 사용하므로 <g>, <clipPath> 대신 <img>와 CSS를 사용합니다.
      */}
      <img
        src={data.attributes.imageUrl}
        alt={data.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: `${BORDER_RADIUS}px`, // CSS로 둥근 모서리 적용
        }}
        // 이미지 로딩 실패 시 대체 텍스트
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://placehold.co/${NODE_WIDTH}x${NODE_HEIGHT}/eee/aaa?text=Image+Not+Found`;
        }}
      />

      {/* 4. 자식 노드로 연결을 보내는 Source Handle (하단) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id={`source-${nodeId}`} // 고유 ID 부여 (옵션)
        style={{ background: "#555", bottom: "-5px" }} // 노드 경계선 밖으로 살짝 이동
        isConnectable={true}
      />
    </div>
  );
};

export default PostNode;
