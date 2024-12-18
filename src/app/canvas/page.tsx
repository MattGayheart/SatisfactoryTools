"use client";

import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { Select } from "@mantine/core";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 250, y: 5 },
    data: { label: "Miner" },
    type: "miner",
  },
];

const initialEdges: Edge[] = [];

// Node Components
const MinerNode = ({ data }: { data: { label: string } }) => (
  <div
    style={{
      padding: "10px",
      background: "yellow",
      borderRadius: "5px",
      textAlign: "center",
      border: "1px solid black",
    }}
  >
    <strong>{data.label}</strong>
    <Handle
      type="target"
      position={Position.Top}
      style={{ background: "blue" }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      style={{ background: "green" }}
    />
  </div>
);

const SmelterNode = ({ data }: { data: { label: string } }) => (
  <div
    style={{
      padding: "10px",
      background: "orange",
      borderRadius: "5px",
      textAlign: "center",
      border: "1px solid black",
    }}
  >
    <strong>{data.label}</strong>
    <Handle
      type="target"
      position={Position.Top}
      style={{ background: "blue" }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      style={{ background: "green" }}
    />
  </div>
);

const ConstructorNode = ({ data }: { data: { label: string } }) => (
  <div
    style={{
      padding: "10px",
      background: "lightgreen",
      borderRadius: "5px",
      textAlign: "center",
      border: "1px solid black",
    }}
  >
    <strong>{data.label}</strong>
    <Handle
      type="target"
      position={Position.Top}
      style={{ background: "blue" }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      style={{ background: "green" }}
    />
  </div>
);

function CanvasPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState("miner");
  const reactFlowInstance = useReactFlow();

  const nodeTypes = useMemo(
    () => ({
      miner: MinerNode,
      smelter: SmelterNode,
      constructor: ConstructorNode,
    }),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = () => {
    if (!reactFlowInstance) return;

    const { x, y, zoom } = reactFlowInstance.getViewport();

    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      position: {
        x: x / zoom + window.innerWidth / 2 / zoom,
        y: y / zoom + window.innerHeight / 2 / zoom,
      },
      data: {
        label: `${selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1)} ${nodes.length + 1}`,
      },
      type: selectedNodeType,
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const saveLayout = async () => {
    try {
      await axios.post("/api/layouts", { nodes, edges });
      alert("Layout saved successfully!");
    } catch (error) {
      console.error("Error saving layout:", error);
      alert("Failed to save layout.");
    }
  };

  const loadLayout = async () => {
    try {
      const { data } = await axios.get("/api/layouts");
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
      alert("Layout loaded successfully!");
    } catch (error) {
      console.error("Error loading layout:", error);
      alert("Failed to load layout.");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Select
          label="Select Node Type"
          value={selectedNodeType}
          onChange={setSelectedNodeType}
          data={[
            { value: "miner", label: "Miner" },
            { value: "smelter", label: "Smelter" },
            { value: "constructor", label: "Constructor" },
          ]}
          style={{ marginBottom: 10 }}
        />
        <button
          onClick={addNode}
          style={{
            display: "block",
            marginBottom: 10,
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Node
        </button>
        <button
          onClick={saveLayout}
          style={{
            display: "block",
            marginBottom: 10,
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save Layout
        </button>
        <button
          onClick={loadLayout}
          style={{
            display: "block",
            marginBottom: 10,
            padding: "10px 20px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Load Layout
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <CanvasPage />
    </ReactFlowProvider>
  );
}
