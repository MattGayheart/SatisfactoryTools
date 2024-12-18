"use client";

import React, { useCallback, useMemo } from "react";
import axios from "axios";
import {
  ReactFlow,
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  Handle,
  useEdgesState,
  useNodesState,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button, Group } from "@mantine/core";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 250, y: 5 },
    data: { label: "Miner" },
    type: "miner",
  },
];

const initialEdges: Edge[] = [];

const CustomMinerNode = ({ data }: { data: { label: string } }) => (
  <div
    style={{
      padding: 10,
      background: "#2d6484",
      borderRadius: "5px",
      color: "white",
    }}
  >
    {data.label}
    {/* Add input and output handles */}
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

export default function CanvasPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Memoize nodeTypes for stability and performance
  const nodeTypes = useMemo(
    () => ({
      miner: CustomMinerNode,
    }),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = () => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodes.length + 1}` },
      type: "miner",
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
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <Group justify="center">
          <Button onClick={addNode} variant="filled" color="#2d6484">
            Add Node
          </Button>
          <Button onClick={saveLayout} variant="filled" color="#2d6484">
            Save Layout
          </Button>
          <Button onClick={loadLayout} variant="filled" color="#2d6484">
            Load Layout
          </Button>
        </Group>
      </div>
    </div>
  );
}
