'use client'

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Tree } from 'react-d3-tree';

const MindChartPage: React.FC = () => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const mindMap = [
    { id: 1, parent_id: null, text: 'Mane' },
    { id: 2, parent_id: 1, text: 'Head-1'},
    { id: 8, parent_id: 1, text: 'Head-2'},
    { id: 3, parent_id: 2, text: 'Hand-one'},
    { id: 4, parent_id: 2, text: 'Body'},
    { id: 5, parent_id: 2, text: 'Hand-two'},
    { id: 6, parent_id: 4, text: 'Footer-one'},
    { id: 7, parent_id: 4, text: 'Footer-two'},
  ];

  // Convert flat array to hierarchical tree structure
  const buildTree = (nodes: any[], parentId: number | null = null): any[] => {
    return nodes
      .filter((node) => node.parent_id == parentId)
      .map((node): any => ({
        name: node.text,
        attributes: { id: node.id },
        children: buildTree(nodes, node.id),
      }));
  };

  const treeData = buildTree(mindMap, null);

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: 20 });
    }
  }, []);

  const CustomNode = ({ nodeDatum, toggleNode }: any) => (
    <g className="cursor-pointer">
      <circle
        r={20}
        fill="#0ea5e9"
        className="transition-all hover:fill-sky-600"
        onClick={toggleNode}
      />
      <text
        x={0}
        y={5}
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="500"
        className="font-sans"
      >
        {nodeDatum.name}
      </text>
    </g>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center mt-4 text-sky-600 hover:text-sky-700 transition-colors"
        >
          ← Back to Home
        </Link>

        <div 
          className="w-full h-[600px] border rounded-lg shadow-lg bg-white mt-4 pt-4"
          ref={containerRef}
        >
          {treeData.length > 0 && (
            <Tree
              data={treeData}
              orientation="vertical"
              translate={translate}
              renderCustomNodeElement={(rd3tProps) => (
                <CustomNode {...rd3tProps} />
              )}
              pathClassFunc={() => 'stroke-sky-300 stroke-2'}
              separation={{ siblings: 1.5, nonSiblings: 2 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MindChartPage;
