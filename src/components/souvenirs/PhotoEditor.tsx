'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload,
  Download,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Type,
  Palette,
  Scissors,
  Save,
  Undo,
  Redo,
  Trash2,
  Plus,
  Minus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditorElement {
  id: string;
  type: 'image' | 'text' | 'stamp';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  opacity: number;
  data: any;
  zIndex: number;
}

interface PhotoEditorProps {
  template: {
    id: string;
    name: string;
    templateType: string;
    templateConfig: any;
  };
  onSave?: (projectData: any) => void;
  onClose?: () => void;
}

export default function PhotoEditor({
  template,
  onSave,
  onClose,
}: PhotoEditorProps) {
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<EditorElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  // 히스토리 관리
  const saveToHistory = useCallback(
    (newElements: EditorElement[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...newElements]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  // 실행 취소
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  // 다시 실행
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // 이미지 업로드
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newElement: EditorElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          rotation: 0,
          scale: 1,
          opacity: 1,
          data: { url: e.target?.result, fileName: file.name },
          zIndex: elements.length,
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        saveToHistory(newElements);
      };
      reader.readAsDataURL(file);
    }
  };

  // 텍스트 추가
  const handleAddText = () => {
    if (textInput.trim()) {
      const newElement: EditorElement = {
        id: `text-${Date.now()}`,
        type: 'text',
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        rotation: 0,
        scale: 1,
        opacity: 1,
        data: {
          text: textInput,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'normal',
          textAlign: 'left',
        },
        zIndex: elements.length,
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      saveToHistory(newElements);
      setTextInput('');
      setShowTextInput(false);
    }
  };

  // 스탬프 추가
  const handleAddStamp = (stampData: any) => {
    const newElement: EditorElement = {
      id: `stamp-${Date.now()}`,
      type: 'stamp',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      scale: 1,
      opacity: 1,
      data: stampData,
      zIndex: elements.length,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
  };

  // 요소 선택
  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId);
  };

  // 요소 이동
  const handleElementMove = (elementId: string, x: number, y: number) => {
    const newElements = elements.map((el) =>
      el.id === elementId ? { ...el, x, y } : el
    );
    setElements(newElements);
  };

  // 요소 크기 조정
  const handleElementResize = (
    elementId: string,
    width: number,
    height: number
  ) => {
    const newElements = elements.map((el) =>
      el.id === elementId ? { ...el, width, height } : el
    );
    setElements(newElements);
  };

  // 요소 회전
  const handleElementRotate = (elementId: string, rotation: number) => {
    const newElements = elements.map((el) =>
      el.id === elementId ? { ...el, rotation } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
  };

  // 요소 삭제
  const handleElementDelete = (elementId: string) => {
    const newElements = elements.filter((el) => el.id !== elementId);
    setElements(newElements);
    setSelectedElement(null);
    saveToHistory(newElements);
  };

  // 줌 조정
  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(3, zoom + delta));
    setZoom(newZoom);
  };

  // 프로젝트 저장
  const handleSave = () => {
    const projectData = {
      templateId: template.id,
      templateType: template.templateType,
      canvasSize,
      elements,
      createdAt: new Date().toISOString(),
    };
    onSave?.(projectData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{template.name} 편집</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            저장
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <div className="w-80 border-r bg-gray-50 p-4 space-y-4 overflow-y-auto">
          {/* 도구 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">도구</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById('image-upload')?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  이미지
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTextInput(true)}
                >
                  <Type className="h-4 w-4 mr-2" />
                  텍스트
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleAddStamp({ type: 'stamp', name: '스탬프' })
                  }
                >
                  <Scissors className="h-4 w-4 mr-2" />
                  스탬프
                </Button>
                <Button variant="outline" size="sm">
                  <Palette className="h-4 w-4 mr-2" />
                  배경
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 텍스트 입력 */}
          <AnimatePresence>
            {showTextInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">텍스트 추가</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Textarea
                      placeholder="텍스트를 입력하세요"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddText}>
                        추가
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowTextInput(false)}
                      >
                        취소
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 레이어 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">레이어</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`p-2 rounded border cursor-pointer ${
                      selectedElement === element.id
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-white'
                    }`}
                    onClick={() => handleElementSelect(element.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {element.type === 'image'
                          ? '🖼️'
                          : element.type === 'text'
                            ? '📝'
                            : '🏷️'}
                        {element.type === 'image'
                          ? element.data.fileName
                          : element.data.text || '스탬프'}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleElementDelete(element.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 속성 */}
          {selectedElement && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">속성</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">X</label>
                    <Input
                      type="number"
                      value={
                        elements.find((el) => el.id === selectedElement)?.x || 0
                      }
                      onChange={(e) => {
                        const element = elements.find(
                          (el) => el.id === selectedElement
                        );
                        if (element) {
                          handleElementMove(
                            element.id,
                            parseInt(e.target.value),
                            element.y
                          );
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Y</label>
                    <Input
                      type="number"
                      value={
                        elements.find((el) => el.id === selectedElement)?.y || 0
                      }
                      onChange={(e) => {
                        const element = elements.find(
                          (el) => el.id === selectedElement
                        );
                        if (element) {
                          handleElementMove(
                            element.id,
                            element.x,
                            parseInt(e.target.value)
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">너비</label>
                    <Input
                      type="number"
                      value={
                        elements.find((el) => el.id === selectedElement)
                          ?.width || 0
                      }
                      onChange={(e) => {
                        const element = elements.find(
                          (el) => el.id === selectedElement
                        );
                        if (element) {
                          handleElementResize(
                            element.id,
                            parseInt(e.target.value),
                            element.height
                          );
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">높이</label>
                    <Input
                      type="number"
                      value={
                        elements.find((el) => el.id === selectedElement)
                          ?.height || 0
                      }
                      onChange={(e) => {
                        const element = elements.find(
                          (el) => el.id === selectedElement
                        );
                        if (element) {
                          handleElementResize(
                            element.id,
                            element.width,
                            parseInt(e.target.value)
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const element = elements.find(
                        (el) => el.id === selectedElement
                      );
                      if (element) {
                        handleElementRotate(element.id, element.rotation - 15);
                      }
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const element = elements.find(
                        (el) => el.id === selectedElement
                      );
                      if (element) {
                        handleElementRotate(element.id, element.rotation + 15);
                      }
                    }}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 캔버스 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 캔버스 컨트롤 */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleZoom(-0.1)}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm">{Math.round(zoom * 100)}%</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleZoom(0.1)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
            </div>
          </div>

          {/* 캔버스 */}
          <div className="flex-1 p-8 bg-gray-100 overflow-auto">
            <div className="flex justify-center">
              <div
                ref={canvasRef}
                className="relative bg-white shadow-lg"
                style={{
                  width: canvasSize.width * zoom,
                  height: canvasSize.height * zoom,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                }}
              >
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute cursor-move ${
                      selectedElement === element.id
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }`}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
                      opacity: element.opacity,
                      zIndex: element.zIndex,
                    }}
                    onClick={() => handleElementSelect(element.id)}
                  >
                    {element.type === 'image' && (
                      <img
                        src={element.data.url}
                        alt={element.data.fileName}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    )}
                    {element.type === 'text' && (
                      <div
                        className="w-full h-full flex items-center justify-center text-black"
                        style={{
                          fontSize: element.data.fontSize,
                          fontFamily: element.data.fontFamily,
                          color: element.data.color,
                          fontWeight: element.data.fontWeight,
                          textAlign: element.data.textAlign,
                        }}
                      >
                        {element.data.text}
                      </div>
                    )}
                    {element.type === 'stamp' && (
                      <div className="w-full h-full bg-yellow-100 border-2 border-dashed border-yellow-400 flex items-center justify-center">
                        <span className="text-yellow-600">🏷️</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
