"use client";

import { TypeTreeItem } from "@/APIs/Art/tree";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  ConnectionLineType,
  MarkerType,
  Handle,
  Position,
} from "reactflow";

// React Flow CSS 임포트
import "reactflow/dist/style.css";

// 레이아웃 계산을 위한 dagre 임포트
import dagre from "dagre";
import PostNode, { NODE_HEIGHT, NODE_WIDTH } from "./CustomNodes/Post";

// --- 1. 커스텀 노드 (PostNode) ---
// PostNode.tsx의 코드를 React Flow용으로 수정

// React Flow의 커스텀 노드는 'data' prop으로 데이터를 받습니다.
export interface PostNodeData {
  name: string;
  attributes: {
    imageUrl: string;
    status: string;
    postId: number;
  };
}

// --- 2. 레이아웃 계산 함수 (Dagre 사용) ---
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

/**
 * Dagre를 사용해 노드 위치를 계산하고 React Flow 엘리먼트로 변환
 * @param apiData API 원본 데이터
 * @param direction 'TB' (Top-to-Bottom) 또는 'LR' (Left-to-Right)
 */
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
        type: ConnectionLineType.Step, // react-d3-tree의 pathFunc="step"과 유사
        style: {
          stroke: "#D3D3D3",
          strokeWidth: 2,
          strokeDasharray: "5 5",
        },
        animated: true,
        // 화살표가 필요하면 추가
        // markerEnd: {
        //   type: MarkerType.ArrowClosed,
        //   color: '#D3D3D3',
        // },
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
      // Dagre의 위치는 노드의 중앙 기준이므로 x, y 조정
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges: initialEdges };
};

// --- 3. 메인 트리 컴포넌트 ---
const DrvTreeFlow = ({ data }: { data: TypeTreeItem[] }) => {
  const [selectedPost, setSelectedPost] = useState<TypeTreeItem | null>(null);

  // 1. 커스텀 노드 타입 등록
  const nodeTypes = useMemo(() => ({ post: PostNode }), []);

  // 2. 레이아웃 계산 (data prop이 바뀔 때만 다시 계산)
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

  // 5. 엣지 연결 시 콜백 (사용자가 노드를 수동으로 연결할 때)
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
              strokeDasharray: "5 5",
            },
            animated: true,
          },
          eds
        )
      ),
    [setEdges]
  );

  return (
    <div className="w-full h-[calc(100%-70px)]">
      {selectedPost ? (
        <div></div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes} // 커스텀 노드 등록
          connectionLineType={ConnectionLineType.Step}
          nodesDraggable={false}
          fitView // 캔버스에 맞게 초기 뷰 조정
        >
          {/* --- 요구사항 기능 --- */}

          {/* 1. 미니맵 (Minimap) */}
          <MiniMap
            nodeStrokeWidth={3}
            pannable={true}
            position="top-right"
            style={{
              border: "1px solid #ddd",
              backgroundColor: "rgba(248, 248, 248, 0.85)",
            }}
          />

          {/* 2. 줌/패닝 컨트롤러 */}
          <Controls showInteractive={false} />

          {/* 3. 캔버스 배경 (점선 또는 격자) */}
          <Background gap={20} color="#f1f1f1" />
        </ReactFlow>
      )}
    </div>
  );
};

export default DrvTreeFlow;
