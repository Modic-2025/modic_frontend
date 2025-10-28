"use client";

import { TypeTreeItem } from "@/APIs/Art/tree";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  addEdge,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  ConnectionLineType,
  NodeProps,
  // 1. ReactFlowProvider를 임포트합니다.
  ReactFlowProvider,
  useReactFlow,
  Background,
} from "reactflow";

// React Flow CSS 임포트
import "reactflow/dist/style.css";

// 레이아웃 계산을 위한 dagre 임포트
import dagre from "dagre";
import PostNode, { NODE_HEIGHT, NODE_WIDTH } from "./CustomNodes/Post";
import Image from "next/image";
import { Background as CustomBackground } from "../Popups";

// --- 1. 커스텀 노드 (PostNode) 데이터 인터페이스 ---
export interface PostNodeData {
  name: string;
  attributes: {
    imageUrl: string;
    status: string;
    postId: number;
  };
  _data: TypeTreeItem;
}

// --- 2. 레이아웃 계산 함수 (Dagre 사용) ---
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (apiData: TypeTreeItem[], direction = "TB") => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 120 });

  const initialNodes: Node<PostNodeData>[] = [];
  const initialEdges: Edge[] = [];

  // 1. 노드 생성 및 Dagre 그래프에 추가
  apiData.forEach((item) => {
    const nodeId = item.postId.toString();
    initialNodes.push({
      id: nodeId,
      type: "post", // 커스텀 노드 타입
      data: {
        name: item.title,
        attributes: {
          imageUrl: item.representativeImageUrl,
          status: item.postStatus,
          postId: item.postId,
        },
        _data: item,
      },
      position: { x: 0, y: 0 }, // Dagre가 계산할 위치
    });
    dagreGraph.setNode(nodeId, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // 2. 엣지 생성 및 Dagre 그래프에 추가
  apiData.forEach((item) => {
    if (item.parentPostId !== null) {
      const edge: Edge = {
        id: `e-${item.parentPostId}-${item.postId}`,
        source: item.parentPostId.toString(),
        target: item.postId.toString(),
        type: ConnectionLineType.Step,
        style: {
          stroke: "#D3D3D3",
          strokeWidth: 2,
        },
        animated: true,
      };
      initialEdges.push(edge);
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  // 3. Dagre 레이아웃 계산 실행
  dagre.layout(dagreGraph);

  // 4. 계산된 위치로 React Flow 노드 업데이트
  const layoutedNodes = initialNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges: initialEdges };
};

// --- 3. React Flow 캔버스 컴포넌트 (내부 분리) ---
// 이 컴포넌트는 ReactFlowProvider 내부에 렌더링되므로 useReactFlow() 사용 가능
const TreeCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  selectedPost,
  lastSelectedPost,
}: {
  nodes: Node<PostNodeData>[];
  edges: Edge[];
  onNodesChange: any; // UseNodesState의 onNodesChange 타입
  onEdgesChange: any; // UseEdgesState의 onEdgesChange 타입
  onConnect: (params: Connection) => void;
  nodeTypes: any; // useMemo로 생성된 nodeTypes 타입
  selectedPost: TypeTreeItem | null;
  lastSelectedPost: TypeTreeItem | null;
}) => {
  // 3-1. useReactFlow 훅을 여기서 호출
  const { fitView } = useReactFlow();

  // 3-2. 줌 효과를 적용하는 useEffect
  useEffect(() => {
    if (selectedPost) {
      fitView({
        nodes: [{ id: selectedPost.postId.toString() }],
        duration: 300,
        maxZoom: 1.2,
      });
    }
  }, [selectedPost, lastSelectedPost, fitView]);

  // 3-3. ReactFlow 캔버스 렌더링
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      connectionLineType={ConnectionLineType.Step}
      nodesDraggable={false}
      fitView
    >
      <MiniMap
        nodeStrokeWidth={3}
        pannable={true}
        position="top-right"
        style={{
          border: "1px solid #ddd",
          backgroundColor: "rgba(248, 248, 248, 0.85)",
        }}
      />
      <Controls showInteractive={false} />
      <Background gap={20} color="#f1f1f1" />
    </ReactFlow>
  );
};

// --- 4. 메인 컴포넌트 (상태 관리 및 Provider 제공) ---
const DrvTreeFlow = ({ data }: { data: TypeTreeItem[] }) => {
  const [selectedPost, setSelectedPost] = useState<TypeTreeItem | null>(null);
  const [sameDepthPosts, setSameDepthPosts] = useState<TypeTreeItem[] | null>(
    null
  );
  const [lastSelectedPost, setLastSelectedPost] = useState<TypeTreeItem | null>(
    null
  );

  useEffect(() => {
    if (selectedPost) {
      const { parentPostId } = selectedPost;
      setSameDepthPosts(
        data.filter((item) => item.parentPostId === parentPostId)
      );
    } else {
      setSameDepthPosts(null);
    }
  }, [selectedPost, data]);

  // 노드 클릭 핸들러
  const handleNodeClick = useCallback(
    ({ _data }: PostNodeData) => {
      setSelectedPost(_data);
      setLastSelectedPost(_data);
    },
    [setSelectedPost, setLastSelectedPost]
  );

  // 1. 커스텀 노드 타입 등록
  const nodeTypes = useMemo(
    () => ({
      post: (props: NodeProps<PostNodeData>) => (
        <PostNode {...props} onClick={handleNodeClick} />
      ),
    }),
    [handleNodeClick] // handleNodeClick이 바뀔 수 있으므로 의존성 배열에 추가
  );

  // 2. 레이아웃 계산
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(data, "TB"),
    [data]
  );

  // 3. React Flow 상태 훅
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // 4. 레이아웃 데이터가 변경되면 노드/엣지 상태 업데이트
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  // 5. 엣지 연결 시 콜백
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: ConnectionLineType.Step,
            style: {
              stroke: "#D3D3D3",
              strokeWidth: 2,
            },
            animated: true,
          },
          eds
        )
      ),
    [setEdges]
  );

  return (
    <div className="w-full h-[calc(100%-70px)] flex items-center">
      {selectedPost && (
        <CustomBackground onClick={() => setSelectedPost(null)}>
          <div className="max-w-84 max-h-[90%]">
            <Image
              src={selectedPost.representativeImageUrl}
              alt={selectedPost.representativeImageUrl}
              fill
              className={`!relative rounded-2xl motion-preset-expand motion-duration-300`}
            />
          </div>
        </CustomBackground>
      )}
      {/* {selectedPost ? (
        <>
          <ul className="absolute my-auto ml-4 flex flex-col items-center rounded-full bg-[rgba(248,248,248,0.4)] border-1 border-[#EDEDED] px-4 py-4">
            <li className="bg-[#FF925F] w-2 h-2 mb-4 rounded-full"></li>
            <li className="bg-[#DBDBDB] w-1 h-1 mb-4 rounded-full"></li>
            <li className="bg-[#DBDBDB] w-1 h-1 rounded-full last:mb-0 "></li>
          </ul>
          <Swiper
            slidesPerView={1}
            spaceBetween={100}
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper min-h-[50vh] h-[60vh]"
          >
            {sameDepthPosts?.map((item) => (
              <SwiperSlide key={item.postId} className="h-full">
                <div className="w-full h-full">
                  <Image
                    src={item.representativeImageUrl}
                    alt={item.representativeImageUrl}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : ( */}
      <ReactFlowProvider>
        <TreeCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          selectedPost={selectedPost}
          lastSelectedPost={lastSelectedPost}
        />
      </ReactFlowProvider>
      {/* )} */}
    </div>
  );
};

export default DrvTreeFlow;
